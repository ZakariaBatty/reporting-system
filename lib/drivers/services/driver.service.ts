import { Prisma, DriverStatus } from "@prisma/client";
import { driverRepository } from "../repositories/driver.repository";

/**
 * Driver Service
 * Contains business logic with role-based authorization
 * All CRUD operations are protected by role checks
 *
 * Responsibilities:
 * - Driver lifecycle management (create, update, delete)
 * - Handle role changes (USER → DRIVER, DRIVER → OTHER)
 * - Authorization checks for driver operations
 * - Driver queries and statistics
 */

interface DriverUpdateData {
  status?: DriverStatus;
  rating?: number;
  licenseNumber?: string;
  licenseExpiry?: string | Date;
  totalTrips?: number;
  totalKm?: number;
  averageRating?: number;
}

export const driverService = {
  /**
   * LIFECYCLE OPERATIONS
   * Moved from User domain to Driver domain
   */

  /**
   * Create a driver profile for a user
   * Called when: User is created with DRIVER role OR user role changes to DRIVER
   */
  async createDriverProfile(
    userId: string,
    options?: { licenseNumber?: string; licenseExpiry?: Date },
  ) {
    // Check if driver already exists
    const existingDriver = await driverRepository.findDriverByUserId(userId);
    if (existingDriver) {
      throw new Error("Driver profile already exists for this user");
    }

    // Default license expiry: 1 year from now
    const licenseExpiry = options?.licenseExpiry || new Date();
    if (!options?.licenseExpiry) {
      licenseExpiry.setFullYear(licenseExpiry.getFullYear() + 1);
    }

    return driverRepository.createDriver({
      userId,
      licenseNumber:
        options?.licenseNumber ||
        `DL-${userId.substring(0, 8).toUpperCase()}`,
      licenseExpiry,
      status: "AVAILABLE",
    });
  },

  /**
   * Handle role change TO DRIVER role
   * Creates driver profile if not exists
   */
  async handleRoleChangeToDriver(userId: string) {
    const existingDriver = await driverRepository.findDriverByUserId(userId);

    if (!existingDriver) {
      // Create new driver profile
      return this.createDriverProfile(userId);
    }

    return existingDriver;
  },

  /**
   * Handle role change FROM DRIVER role
   * Soft-deletes the driver profile
   */
  async handleRoleChangeFromDriver(userId: string) {
    const driver = await driverRepository.findDriverByUserId(userId);

    if (driver) {
      // Soft delete the driver profile
      return driverRepository.deleteDriver(driver.id);
    }
  },

  /**
   * Delete driver profile for a user
   * Called when user is deleted
   */
  async deleteDriverProfile(userId: string) {
    const driver = await driverRepository.findDriverByUserId(userId);

    if (driver) {
      return driverRepository.deleteDriver(driver.id);
    }
  },

  /**
   * QUERY OPERATIONS
   */

  /**
   * Get drivers for a user based on their role
   */
  async getDrivers(userId: string, userRole: string) {
    if (!["DRIVER", "MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      throw new Error("Unauthorized: Cannot view drivers");
    }

    return driverRepository.findDriversForUser(userId, userRole);
  },

  /**
   * Get a single driver with authorization check
   */
  async getDriver(driverId: string, userId: string, userRole: string) {
    const driver = await driverRepository.findDriverById(driverId);
    if (!driver) {
      throw new Error("Driver not found");
    }

    // Check authorization
    const canViewAllDrivers = ["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(
      userRole,
    );

    if (!canViewAllDrivers) {
      // Drivers can only view their own profile
      if (driver.userId !== userId) {
        throw new Error("Unauthorized: Cannot view this driver profile");
      }
    }

    return driver;
  },

  /**
   * UPDATE OPERATIONS
   */

  /**
   * Update a driver profile (Manager/Admin only or own profile for drivers)
   */
  async updateDriver(
    driverId: string,
    userId: string,
    userRole: string,
    driverData: DriverUpdateData,
  ) {
    // Check authorization
    const canUpdateAllDrivers = ["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(
      userRole,
    );

    const driver = await driverRepository.findDriverById(driverId);
    if (!driver) {
      throw new Error("Driver not found");
    }

    if (!canUpdateAllDrivers) {
      // Drivers can only update their own profile
      if (driver.userId !== userId) {
        throw new Error("Unauthorized: Cannot update this driver profile");
      }
    }

    // Check license number uniqueness if being changed
    if (
      driverData.licenseNumber &&
      driverData.licenseNumber !== driver.licenseNumber
    ) {
      const isUnique = await driverRepository.isLicenseNumberUnique(
        driverData.licenseNumber,
        driverId,
      );
      if (!isUnique) {
        throw new Error("License number already exists");
      }
    }

    // Build update data
    const updateInput: Prisma.DriverUpdateInput = {};

    if (driverData.status !== undefined) updateInput.status = driverData.status;
    if (driverData.rating !== undefined) updateInput.rating = driverData.rating;
    if (driverData.licenseNumber)
      updateInput.licenseNumber = driverData.licenseNumber;
    if (driverData.licenseExpiry)
      updateInput.licenseExpiry = new Date(driverData.licenseExpiry);
    if (driverData.totalTrips !== undefined)
      updateInput.totalTrips = driverData.totalTrips;
    if (driverData.totalKm !== undefined)
      updateInput.totalKm = driverData.totalKm;
    if (driverData.averageRating !== undefined)
      updateInput.averageRating = driverData.averageRating;

    return driverRepository.updateDriver(driverId, updateInput);
  },

  /**
   * DELETE OPERATIONS
   */

  /**
   * Delete a driver (Manager/Admin only)
   */
  async deleteDriver(driverId: string, userRole: string) {
    // Validation: Only managers and admins can delete drivers
    if (!["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      throw new Error("Unauthorized: Cannot delete drivers");
    }

    const driver = await driverRepository.findDriverById(driverId);
    if (!driver) {
      throw new Error("Driver not found");
    }

    return driverRepository.deleteDriver(driverId);
  },

  /**
   * UTILITY OPERATIONS
   */

  /**
   * Check if a user can access a specific driver
   */
  async canUserAccessDriver(
    driverId: string,
    userId: string,
    userRole: string,
  ): Promise<boolean> {
    // Managers/Admins can access all drivers
    if (["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      return true;
    }

    // Drivers can only access their own profile
    if (userRole === "DRIVER") {
      const driver = await driverRepository.findDriverById(driverId);
      if (!driver) return false;
      return driver.userId === userId;
    }

    return false;
  },

  /**
   * Get drivers with expiring licenses
   */
  async getExpiringSoonLicenses() {
    return driverRepository.getExpiringSoonLicenses();
  },

  /**
   * Get top-rated drivers
   */
  async getTopRatedDrivers(limit: number = 5) {
    return driverRepository.getTopRatedDrivers(limit);
  },
};
