'use server'

import { auth } from '@/lib/auth'
import { tripService } from '@/lib/trips/services/trip.service'

/**
 * Server Actions for Trips
 * All actions are protected by NextAuth and role-based authorization
 * Each action validates the user session before executing
 */

/**
 * Get all trips for the authenticated user
 * Drivers see only their trips, others see all
 */
export async function getTripsAction() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized: Not authenticated')
  }

  try {
    const trips = await tripService.getTripsForUser(
      session.user.id,
      (session.user as any).role || 'driver',
    )

    return {
      success: true,
      data: trips,
      error: null,
    }
  } catch (error) {
    console.error('[getTripsAction] Error:', error)
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch trips',
    }
  }
}

/**
 * Create a new trip
 * Drivers auto-assign to themselves
 * Others choose the driver
 */
export async function createTripAction(formData: {
  tripDate: string
  departureTime: string
  estimatedArrivalTime?: string
  pickupLocation: string
  dropoffLocation: string
  destination: string
  type: 'OUT' | 'IN'
  passengersCount: number
  kmStart: number
  notes?: string
  agencyId: string
  hotelId: string
  vehicleId: string
  driverId?: string
}) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized: Not authenticated')
  }

  try {
    const trip = await tripService.createTrip(
      session.user.id,
      (session.user as any).role || 'driver',
      formData,
    )

    return {
      success: true,
      data: trip,
      error: null,
    }
  } catch (error) {
    console.error('[createTripAction] Error:', error)
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to create trip',
    }
  }
}

/**
 * Update an existing trip
 * Drivers can only update their own trips
 * Managers/Admins can update any trip
 */
export async function updateTripAction(
  tripId: string,
  formData: {
    tripDate?: string
    departureTime?: string
    estimatedArrivalTime?: string
    actualArrivalTime?: string
    pickupLocation?: string
    dropoffLocation?: string
    destination?: string
    type?: 'OUT' | 'IN'
    status?: 'SCHEDULED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    passengersCount?: number
    kmStart?: number
    kmEnd?: number
    distanceTravelled?: number
    tripPrice?: number
    actualCost?: number
    notes?: string
    agencyId?: string
    hotelId?: string
    vehicleId?: string
    driverId?: string
  },
) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized: Not authenticated')
  }

  try {
    const trip = await tripService.updateTrip(
      tripId,
      session.user.id,
      (session.user as any).role || 'driver',
      formData,
    )

    return {
      success: true,
      data: trip,
      error: null,
    }
  } catch (error) {
    console.error('[updateTripAction] Error:', error)
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update trip',
    }
  }
}

/**
 * Delete a trip
 * Only Managers/Admins/Super Admins can delete
 */
export async function deleteTripAction(tripId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized: Not authenticated')
  }

  try {
    await tripService.deleteTrip(tripId, (session.user as any).role || 'driver')

    return {
      success: true,
      data: null,
      error: null,
    }
  } catch (error) {
    console.error('[deleteTripAction] Error:', error)
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to delete trip',
    }
  }
}

/**
 * Get trip statistics
 */
export async function getTripStatsAction() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized: Not authenticated')
  }

  try {
    const stats = await tripService.getTripStats(
      session.user.id,
      (session.user as any).role || 'driver',
    )

    return {
      success: true,
      data: stats,
      error: null,
    }
  } catch (error) {
    console.error('[getTripStatsAction] Error:', error)
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch trip stats',
    }
  }
}

/**
 * Get total passengers
 */
export async function getTotalPassengersAction() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized: Not authenticated')
  }

  try {
    const total = await tripService.getTotalPassengers(
      session.user.id,
      (session.user as any).role || 'driver',
    )

    return {
      success: true,
      data: total,
      error: null,
    }
  } catch (error) {
    console.error('[getTotalPassengersAction] Error:', error)
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch passenger count',
    }
  }
}

/**
 * Get reference data for forms (agencies, hotels, drivers, vehicles)
 */
export async function getReferenceDataAction() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized: Not authenticated')
  }

  try {
    const data = await tripService.getReferenceData()

    return {
      success: true,
      data,
      error: null,
    }
  } catch (error) {
    console.error('[getReferenceDataAction] Error:', error)
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch reference data',
    }
  }
}
