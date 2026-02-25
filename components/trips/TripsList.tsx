'use client'

import React from 'react'
import {
  Trash2,
  Edit2,
  MapPin,
  Clock,
  Users,
} from 'lucide-react'
import { TripStatusBadge, TripTypeBadge } from '@/components/shared'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Trip {
  id: string
  tripDate: string | Date
  departureTime: string
  pickupLocation: string
  dropoffLocation: string
  destination: string
  driver: {
    user: {
      id: string
      name: string
      email: string
    }
  }
  vehicle: {
    id: string
    plate: string
    model: string
  }
  agency: {
    id: string
    name: string
  }
  hotel: {
    id: string
    name: string
  }
  passengersCount: number
  kmStart: number
  kmEnd?: number | null
  type: 'OUT' | 'IN'
  status: string
}

interface TripsListProps {
  trips: Trip[]
  userRole: string
  userId: string
  onEdit: (trip: Trip) => void
  onDelete: (tripId: string) => void
  isDeleting: boolean
}

export function TripsList({
  trips,
  userRole,
  userId,
  onEdit,
  onDelete,
  isDeleting,
}: TripsListProps) {
  const canDelete = ['manager', 'admin', 'super_admin'].includes(userRole)
  const canEdit = userRole === 'driver' || ['manager', 'admin', 'super_admin'].includes(userRole)

  const canEditTrip = (trip: Trip) => {
    if (!canEdit) return false
    if (userRole === 'driver') {
      return trip.driver.user.id === userId
    }
    return true
  }

  if (trips.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardContent className="flex items-center justify-center py-16 text-center">
          <div>
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No trips found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              <th className="whitespace-nowrap px-4 py-3 text-left">Date</th>
              <th className="whitespace-nowrap px-4 py-3 text-left">Time</th>
              <th className="whitespace-nowrap px-4 py-3 text-left">Agency</th>
              <th className="whitespace-nowrap px-4 py-3 text-left">Hotel</th>
              <th className="whitespace-nowrap px-4 py-3 text-left">Destination</th>
              <th className="whitespace-nowrap px-4 py-3 text-left">Driver</th>
              <th className="whitespace-nowrap px-4 py-3 text-left">PAX</th>
              <th className="whitespace-nowrap px-4 py-3 text-left">Distance</th>
              <th className="whitespace-nowrap px-4 py-3 text-left">Type</th>
              <th className="whitespace-nowrap px-4 py-3 text-left">Status</th>
              <th className="whitespace-nowrap px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {trips.map((trip) => {
              const tripDate = new Date(trip.tripDate)
              const formattedDate = tripDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })

              const distance =
                trip.kmEnd && trip.kmStart
                  ? `${trip.kmEnd - trip.kmStart} km`
                  : `${trip.kmStart} km`

              return (
                <tr key={trip.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                    {formattedDate}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-bold whitespace-nowrap">
                    {trip.departureTime}
                  </td>
                  <td className="px-4 py-3 font-semibold">{trip.agency.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{trip.hotel.name}</td>
                  <td className="px-4 py-3 font-medium">{trip.destination}</td>
                  <td className="px-4 py-3">{trip.driver.user.name}</td>
                  <td className="px-4 py-3 font-mono text-center">{trip.passengersCount}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {distance}
                  </td>
                  <td className="px-4 py-3">
                    <TripTypeBadge type={trip.type} />
                  </td>
                  <td className="px-4 py-3">
                    <TripStatusBadge status={trip.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {canEditTrip(trip) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(trip)}
                          title="Edit trip"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(trip.id)}
                          disabled={isDeleting}
                          title="Delete trip"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                      {!canEditTrip(trip) && !canDelete && (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
