import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/client";
import { tripRepository } from "../repositories/trip.repository";

/**
 * Trip Service
 * Contains business logic with role-based authorization
 * All CRUD operations are protected by role checks
 */

interface TripCreateData {
  tripDate: string | Date;
  departureTime: string;
  estimatedArrivalTime?: string;
  pickupLocation: string;
  dropoffLocation: string;
  destination: string;
  type: "OUT" | "IN";
  passengersCount: number;
  kmStart: number;
  notes?: string;
  agencyId: string;
  hotelId: string;
  vehicleId: string;
  driverId?: string;
}

interface TripUpdateData {
  tripDate?: string | Date;
  departureTime?: string;
  estimatedArrivalTime?: string;
  actualArrivalTime?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  destination?: string;
  type?: "OUT" | "IN";
  status?: "SCHEDULED" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  passengersCount?: number;
  kmStart?: number;
  kmEnd?: number;
  distanceTravelled?: number;
  tripPrice?: number;
  actualCost?: number;
  notes?: string;
  agencyId?: string;
  hotelId?: string;
  vehicleId?: string;
  driverId?: string;
}

export const tripService = {
  /**
   * Get trips for authenticated user
   * Drivers see only their trips
   * Managers/Admins/Super Admins see all trips
   */
  async getTripsForUser(userId: string, userRole: string) {
    return tripRepository.findTripsForUser(userId, userRole);
  },

  /**
   * Get trip statistics based on user role
   */
  async getTripStats(userId: string, userRole: string) {
    return tripRepository.getTripStats(
      userRole,
      userRole === "DRIVER" ? userId : undefined,
    );
  },

  /**
   * Get total passengers based on user role
   */
  async getTotalPassengers(userId: string, userRole: string) {
    return tripRepository.getTotalPassengers(
      userRole,
      userRole === "DRIVER" ? userId : undefined,
    );
  },

  /**
   * Create a new trip with role-based logic
   * Drivers: Auto-assign themselves
   * Managers/Admins: Choose any driver
   */
  async createTrip(userId: string, userRole: string, tripData: TripCreateData) {
    // Validation: All roles can create trips
    if (!["DRIVER", "MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      throw new Error("Unauthorized: Cannot create trips");
    }

    // Build create data
    let driverId = tripData.driverId;

    if (userRole === "DRIVER") {
      // Drivers auto-assign to themselves
      // Get the driver record for this user
      const driver = await prisma.driver.findUnique({
        where: { userId },
      });

      if (!driver) {
        throw new Error("Driver profile not found for this user");
      }

      driverId = driver.id;
    } else {
      // Managers/Admins must specify a driver
      if (!tripData.driverId) {
        throw new Error("Driver must be assigned for this role");
      }
    }

    const createInput: Prisma.TripCreateInput = {
      tripDate: new Date(tripData.tripDate),
      departureTime: tripData.departureTime,
      estimatedArrivalTime: tripData.estimatedArrivalTime,
      pickupLocation: tripData.pickupLocation,
      dropoffLocation: tripData.dropoffLocation,
      destination: tripData.destination,
      type: tripData.type,
      passengersCount: tripData.passengersCount,
      kmStart: tripData.kmStart,
      notes: tripData.notes,
      status: "SCHEDULED",
      agency: { connect: { id: tripData.agencyId } },
      hotel: { connect: { id: tripData.hotelId } },
      vehicle: { connect: { id: tripData.vehicleId } },
      driver: { connect: { id: driverId } },
    };

    return tripRepository.createTrip(createInput);
  },

  /**
   * Update a trip with role-based authorization
   * Drivers: Can only update their own trips
   * Managers/Admins: Can update all trips
   */
  async updateTrip(
    tripId: string,
    userId: string,
    userRole: string,
    tripData: TripUpdateData,
  ) {
    // Check authorization
    const canUpdateAllTrips = ["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(
      userRole,
    );

    if (!canUpdateAllTrips) {
      const trip = await tripRepository.findTripById(tripId);
      if (!trip) {
        throw new Error("Trip not found");
      }

      // Drivers can only update their own trips
      if (userRole === "DRIVER" && trip.driverId !== userId) {
        // Get driver ID from user
        const driver = await prisma.driver.findUnique({
          where: { userId },
        });

        if (!driver || trip.driverId !== driver.id) {
          throw new Error("Unauthorized: Cannot update this trip");
        }
      }
    }

    // Build update data, ensuring drivers can't change their assignment
    const updateInput: Prisma.TripUpdateInput = {};

    if (tripData.tripDate) updateInput.tripDate = new Date(tripData.tripDate);
    if (tripData.departureTime)
      updateInput.departureTime = tripData.departureTime;
    if (tripData.estimatedArrivalTime !== undefined)
      updateInput.estimatedArrivalTime = tripData.estimatedArrivalTime;
    if (tripData.actualArrivalTime !== undefined)
      updateInput.actualArrivalTime = tripData.actualArrivalTime;
    if (tripData.pickupLocation)
      updateInput.pickupLocation = tripData.pickupLocation;
    if (tripData.dropoffLocation)
      updateInput.dropoffLocation = tripData.dropoffLocation;
    if (tripData.destination) updateInput.destination = tripData.destination;
    if (tripData.type) updateInput.type = tripData.type;
    if (tripData.status) updateInput.status = tripData.status;
    if (tripData.passengersCount)
      updateInput.passengersCount = tripData.passengersCount;
    if (tripData.kmStart !== undefined) updateInput.kmStart = tripData.kmStart;
    if (tripData.kmEnd !== undefined) updateInput.kmEnd = tripData.kmEnd;
    if (tripData.distanceTravelled !== undefined)
      updateInput.distanceTravelled = tripData.distanceTravelled;
    if (tripData.tripPrice !== undefined)
      updateInput.tripPrice = tripData.tripPrice;
    if (tripData.actualCost !== undefined)
      updateInput.actualCost = tripData.actualCost;
    if (tripData.notes !== undefined) updateInput.notes = tripData.notes;

    // Only managers/admins can change agency/hotel/vehicle/driver
    if (canUpdateAllTrips) {
      if (tripData.agencyId)
        updateInput.agency = { connect: { id: tripData.agencyId } };
      if (tripData.hotelId)
        updateInput.hotel = { connect: { id: tripData.hotelId } };
      if (tripData.vehicleId)
        updateInput.vehicle = { connect: { id: tripData.vehicleId } };
      if (tripData.driverId)
        updateInput.driver = { connect: { id: tripData.driverId } };
    }

    return tripRepository.updateTrip(tripId, updateInput);
  },

  /**
   * Delete a trip with role-based authorization
   * Only Managers/Admins/Super Admins can delete
   * Drivers cannot delete
   */
  async deleteTrip(tripId: string, userRole: string) {
    // Only managers/admins can delete
    if (!["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      throw new Error("Unauthorized: Cannot delete trips");
    }

    return tripRepository.deleteTrip(tripId);
  },

  /**
   * Check if a user can access a specific trip
   */
  async canUserAccessTrip(
    tripId: string,
    userId: string,
    userRole: string,
  ): Promise<boolean> {
    // Managers/Admins can access all trips
    if (["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      return true;
    }

    // Drivers can only access their own trips
    if (userRole === "DRIVER") {
      const trip = await tripRepository.findTripById(tripId);
      if (!trip) return false;

      const driver = await prisma.driver.findUnique({
        where: { userId },
      });

      if (!driver) return false;

      return trip.driverId === driver.id;
    }

    return false;
  },

  /**
   * Get reference data (agencies, hotels, drivers, vehicles)
   */
  async getReferenceData() {
    const [agencies, hotels, drivers, vehicles] = await Promise.all([
      tripRepository.getAgencies(),
      tripRepository.getHotels(),
      tripRepository.getDrivers(),
      tripRepository.getVehicles(),
    ]);

    return {
      agencies,
      hotels,
      drivers,
      vehicles,
    };
  },
};
