// Prisma Client Utility Functions
// Helper functions for common database operations with proper type safety and error handling

import prisma from "./client";

// ───────────────────────────────────────────────────────────────────────────────
// USER & AUTHENTICATION UTILITIES
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Create a new user with appropriate role and permissions
 */
export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: "DRIVER" | "MANAGER" | "ADMIN" | "SUPER_ADMIN";
  department?: string;
  avatar?: string;
}) {
  return await prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      role: data.role,
      department: data.department,
      avatar: data.avatar,
      status: "ACTIVE",
      // Auto-create permissions record
      permissions: {
        create: {
          // Permissions set based on role in separate function
        },
      },
    },
    include: {
      permissions: true,
    },
  });
}

/**
 * Get user with full profile including permissions
 */
export async function getUserWithPermissions(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      permissions: true,
      driver: {
        include: {
          vehicleAssignments: {
            where: { isActive: true },
            include: { vehicle: true },
          },
        },
      },
    },
  });
}

/**
 * Update user permissions based on role
 */
export async function setPermissionsByRole(
  userId: string,
  role: "DRIVER" | "MANAGER" | "ADMIN" | "SUPER_ADMIN",
) {
  const permissionMap = {
    DRIVER: {
      canAccessDashboard: true,
      canAccessTrips: true,
      canAccessProfile: true,
      canAccessCalendar: true,
    },
    MANAGER: {
      canAccessDashboard: true,
      canAccessTrips: true,
      canAccessDrivers: true,
      canAccessVehicles: true,
      canAccessMaintenance: true,
      canAccessAgencies: true,
      canAccessHotels: true,
      canAccessReports: true,
      canAccessUsers: true,
      canAccessProfile: true,
      canAccessCalendar: true,
      canExportData: true,
    },
    ADMIN: {
      canAccessDashboard: true,
      canAccessTrips: true,
      canAccessDrivers: true,
      canAccessVehicles: true,
      canAccessMaintenance: true,
      canAccessAgencies: true,
      canAccessHotels: true,
      canAccessReports: true,
      canAccessUsers: true,
      canAccessProfile: true,
      canAccessCalendar: true,
      canManageUsers: true,
      canManagePermissions: true,
      canExportData: true,
      canDeleteData: true,
      canViewReports: true,
    },
    SUPER_ADMIN: {
      canAccessDashboard: true,
      canAccessTrips: true,
      canAccessDrivers: true,
      canAccessVehicles: true,
      canAccessMaintenance: true,
      canAccessAgencies: true,
      canAccessHotels: true,
      canAccessReports: true,
      canAccessUsers: true,
      canAccessProfile: true,
      canAccessCalendar: true,
      canManageUsers: true,
      canManageRoles: true,
      canManagePermissions: true,
      canExportData: true,
      canDeleteData: true,
      canViewReports: true,
    },
  };

  return await prisma.permission.upsert({
    where: { userId },
    update: permissionMap[role],
    create: {
      userId,
      ...permissionMap[role],
    },
  });
}

// ───────────────────────────────────────────────────────────────────────────────
// DRIVER UTILITIES
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Create a driver user account
 */
export async function createDriverUser(data: {
  email: string;
  password: string;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: Date;
}) {
  return await prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      role: "DRIVER",
      status: "ACTIVE",
      driver: {
        create: {
          licenseNumber: data.licenseNumber,
          licenseExpiry: data.licenseExpiry,
          status: "AVAILABLE",
        },
      },
      permissions: {
        create: {
          canAccessDashboard: true,
          canAccessTrips: true,
          canAccessProfile: true,
          canAccessCalendar: true,
        },
      },
    },
    include: {
      driver: true,
      permissions: true,
    },
  });
}

/**
 * Get driver's current trip (if any)
 */
export async function getDriverCurrentTrip(driverId: string) {
  return await prisma.trip.findFirst({
    where: {
      driverId,
      status: { in: ["ASSIGNED", "IN_PROGRESS"] },
      deletedAt: null,
    },
    include: {
      vehicle: true,
      agency: true,
      hotel: true,
      images: true,
    },
  });
}

/**
 * Get driver's trips for a date range
 */
export async function getDriverTripsInRange(
  driverId: string,
  startDate: Date,
  endDate: Date,
) {
  return await prisma.trip.findMany({
    where: {
      driverId,
      tripDate: {
        gte: startDate,
        lte: endDate,
      },
      deletedAt: null,
    },
    include: {
      vehicle: true,
      agency: true,
      hotel: true,
    },
    orderBy: {
      tripDate: "asc",
    },
  });
}

/**
 * Assign vehicle to driver
 */
export async function assignVehicleToDriver(
  driverId: string,
  vehicleId: string,
) {
  // Unassign any active assignments for this vehicle
  await prisma.vehicleAssignment.updateMany({
    where: {
      vehicleId,
      isActive: true,
    },
    data: {
      unassignedAt: new Date(),
      isActive: false,
    },
  });

  // Create new assignment
  return await prisma.vehicleAssignment.create({
    data: {
      vehicleId,
      driverId,
      isActive: true,
    },
    include: {
      vehicle: true,
      driver: true,
    },
  });
}

// ───────────────────────────────────────────────────────────────────────────────
// TRIP UTILITIES
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Create a new trip with all relationships
 */
export async function createTrip(data: {
  tripDate: Date;
  departureTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  destination: string;
  type: "IN" | "OUT";
  passengersCount: number;
  agencyId: string;
  hotelId: string;
  vehicleId: string;
  driverId: string;
  notes?: string;
  tripPrice?: number;
  assignedByUserId: string;
}) {
  return await prisma.trip.create({
    data: {
      tripDate: data.tripDate,
      departureTime: data.departureTime,
      pickupLocation: data.pickupLocation,
      dropoffLocation: data.dropoffLocation,
      destination: data.destination,
      type: data.type,
      passengersCount: data.passengersCount,
      agencyId: data.agencyId,
      hotelId: data.hotelId,
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      notes: data.notes,
      tripPrice: data.tripPrice,
      status: "ASSIGNED",
      kmStart: 0,
      assignments: {
        create: {
          assignedByUserId: data.assignedByUserId,
        },
      },
    },
    include: {
      vehicle: true,
      driver: true,
      agency: true,
      hotel: true,
      assignments: true,
    },
  });
}

/**
 * Get trips with filters
 */
export async function getTripsFiltered(filters: {
  status?: "SCHEDULED" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  driverId?: string;
  vehicleId?: string;
  agencyId?: string;
  startDate?: Date;
  endDate?: Date;
  type?: "IN" | "OUT";
}) {
  return await prisma.trip.findMany({
    where: {
      deletedAt: null,
      ...(filters.status && { status: filters.status }),
      ...(filters.driverId && { driverId: filters.driverId }),
      ...(filters.vehicleId && { vehicleId: filters.vehicleId }),
      ...(filters.agencyId && { agencyId: filters.agencyId }),
      ...(filters.type && { type: filters.type }),
      ...((filters.startDate || filters.endDate) && {
        tripDate: {
          ...(filters.startDate && { gte: filters.startDate }),
          ...(filters.endDate && { lte: filters.endDate }),
        },
      }),
    },
    include: {
      vehicle: true,
      driver: {
        include: {
          user: true,
        },
      },
      agency: true,
      hotel: true,
      images: true,
    },
    orderBy: {
      tripDate: "desc",
    },
  });
}

/**
 * Update trip status
 */
export async function updateTripStatus(
  tripId: string,
  status: string,
  userId: string,
) {
  const trip = await prisma.trip.update({
    where: { id: tripId },
    data: { status: status as any },
  });

  // Log to audit trail
  await logAuditAction(
    userId,
    "UPDATE",
    "Trip",
    tripId,
    `Status changed to ${status}`,
  );

  return trip;
}

// ───────────────────────────────────────────────────────────────────────────────
// VEHICLE UTILITIES
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Get vehicles available for assignment
 */
export async function getAvailableVehicles() {
  return await prisma.vehicle.findMany({
    where: {
      status: "AVAILABLE",
      deletedAt: null,
    },
    include: {
      assignments: {
        where: { isActive: true },
      },
    },
  });
}

/**
 * Get vehicle's maintenance history
 */
export async function getVehicleMaintenanceHistory(vehicleId: string) {
  return await prisma.maintenanceRecord.findMany({
    where: {
      vehicleId,
      deletedAt: null,
    },
    orderBy: {
      scheduledDate: "desc",
    },
  });
}

/**
 * Get vehicles due for maintenance
 */
export async function getVehiclesDueForMaintenance() {
  const now = new Date();
  return await prisma.vehicle.findMany({
    where: {
      deletedAt: null,
      nextMaintenanceDate: {
        lte: now,
      },
    },
  });
}

/**
 * Schedule maintenance for vehicle
 */
export async function scheduleVehicleMaintenance(data: {
  vehicleId: string;
  maintenanceType: string;
  description: string;
  scheduledDate: Date;
  estimatedCost?: number;
  notes?: string;
}) {
  return await prisma.maintenanceRecord.create({
    data: {
      vehicleId: data.vehicleId,
      maintenanceType: data.maintenanceType as any,
      description: data.description,
      scheduledDate: data.scheduledDate,
      estimatedCost: data.estimatedCost,
      notes: data.notes,
      status: "SCHEDULED",
    },
  });
}

// ───────────────────────────────────────────────────────────────────────────────
// AUDIT LOGGING
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Log audit action
 */
export async function logAuditAction(
  userId: string | undefined,
  action: string,
  entityType: string,
  entityId: string,
  changes?: string,
  ipAddress?: string,
  userAgent?: string,
) {
  return await prisma.auditLog.create({
    data: {
      userId: userId || undefined,
      action,
      entityType,
      entityId,
      changes,
      ipAddress,
      userAgent,
    },
  });
}

/**
 * Get audit trail for entity
 */
export async function getAuditTrail(entityType: string, entityId: string) {
  return await prisma.auditLog.findMany({
    where: {
      entityType,
      entityId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// ───────────────────────────────────────────────────────────────────────────────
// REPORT UTILITIES
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Get dashboard stats
 */
export async function getDashboardStats(startDate: Date, endDate: Date) {
  const [trips, drivers, vehicles, agencies] = await Promise.all([
    prisma.trip.findMany({
      where: {
        tripDate: {
          gte: startDate,
          lte: endDate,
        },
        deletedAt: null,
      },
    }),
    prisma.driver.findMany({
      where: {
        deletedAt: null,
      },
    }),
    prisma.vehicle.findMany({
      where: {
        deletedAt: null,
      },
    }),
    prisma.agency.findMany({
      where: {
        deletedAt: null,
      },
    }),
  ]);

  const completedTrips = trips.filter((t) => t.status === "COMPLETED");
  const totalPassengers = completedTrips.reduce(
    (sum, t) => sum + t.passengersCount,
    0,
  );
  const totalDistance = completedTrips.reduce(
    (sum, t) => sum + (t.distanceTravelled || 0),
    0,
  );
  const totalRevenue = completedTrips.reduce(
    (sum, t) => sum + (t.actualCost || 0),
    0,
  );

  return {
    totalTrips: trips.length,
    completedTrips: completedTrips.length,
    totalPassengers,
    totalDistance,
    totalRevenue,
    activeDrivers: drivers.filter((d) => d.status === "AVAILABLE").length,
    vehiclesInUse: vehicles.filter((v) => v.status === "IN_USE").length,
    agenciesCount: agencies.length,
  };
}

/**
 * Generate export data for trips
 */
export async function exportTripsToExcel(filters: {
  startDate?: Date;
  endDate?: Date;
  status?: string;
  agencyId?: string;
}) {
  const trips = await getTripsFiltered({
    status: filters.status as any,
    agencyId: filters.agencyId,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  return trips.map((trip) => ({
    "Trip Date": trip.tripDate.toISOString().split("T")[0],
    "Departure Time": trip.departureTime,
    Driver: trip.driver.user.name,
    Vehicle: trip.vehicle.plate,
    Agency: trip.agency.name,
    Hotel: trip.hotel.name,
    Destination: trip.destination,
    Passengers: trip.passengersCount,
    "Distance (KM)": trip.distanceTravelled,
    Status: trip.status,
    Type: trip.type,
  }));
}

// ───────────────────────────────────────────────────────────────────────────────
// SOFT DELETE UTILITIES
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Soft delete a user
 */
export async function softDeleteUser(userId: string, deletedByUserId: string) {
  await logAuditAction(deletedByUserId, "DELETE", "User", userId);
  return await prisma.user.update({
    where: { id: userId },
    data: { status: "INACTIVE" },
  });
}

/**
 * Soft delete a trip
 */
export async function softDeleteTrip(tripId: string, deletedByUserId: string) {
  await logAuditAction(deletedByUserId, "DELETE", "Trip", tripId);
  return await prisma.trip.update({
    where: { id: tripId },
    data: { deletedAt: new Date() },
  });
}

/**
 * Restore soft-deleted entity
 */
export async function restoreEntity(
  entityType: string,
  entityId: string,
  restoredByUserId: string,
) {
  await logAuditAction(restoredByUserId, "RESTORE", entityType, entityId);

  switch (entityType) {
    case "Trip":
      return await prisma.trip.update({
        where: { id: entityId },
        data: { deletedAt: null },
      });
    case "Driver":
      return await prisma.driver.update({
        where: { id: entityId },
        data: { deletedAt: null },
      });
    case "Vehicle":
      return await prisma.vehicle.update({
        where: { id: entityId },
        data: { deletedAt: null },
      });
    default:
      throw new Error(`Unknown entity type: ${entityType}`);
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// CLEANUP & CONNECTION
// ───────────────────────────────────────────────────────────────────────────────

export async function closeConnection() {
  await prisma.$disconnect();
}

export default prisma;
