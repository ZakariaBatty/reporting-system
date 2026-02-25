'use client'

import React from 'react'
import {
  Plus,
  Search,
  MapPin,
  CheckCircle,
  Activity,
  Users,
} from 'lucide-react'
import { StatCard, PageHeader } from '@/components/shared'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TripStats {
  totalTrips: number
  completedTrips: number
  inProgressTrips: number
  scheduledTrips: number
}

interface TripsHeaderProps {
  stats: TripStats | null
  totalPassengers: number | null
  isLoading: boolean
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  agencyFilter: string
  onAgencyFilterChange: (value: string) => void
  agencies: Array<{ id: string; name: string }>
  onCreateNew: () => void
  userRole: string
}

export function TripsHeader({
  stats,
  totalPassengers,
  isLoading,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  agencyFilter,
  onAgencyFilterChange,
  agencies,
  onCreateNew,
  userRole,
}: TripsHeaderProps) {
  return (
    <>
      <PageHeader
        title="Trips Management"
        subtitle="Manage and monitor all transportation operations"
        actions={
          <Button onClick={onCreateNew} size="sm">
            <Plus className="size-4 mr-2" /> New Trip
          </Button>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Trips"
          value={stats?.totalTrips ?? 0}
          icon={MapPin}
          variant="default"
        />
        <StatCard
          label="Completed"
          value={stats?.completedTrips ?? 0}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          label="In Progress"
          value={stats?.inProgressTrips ?? 0}
          icon={Activity}
          variant="accent"
        />
        <StatCard
          label="Total Passengers"
          value={totalPassengers ?? 0}
          icon={Users}
          variant="purple"
        />
      </div>

      {/* Filters */}
      <Card className="mb-4 shadow-sm">
        <CardContent className="flex flex-wrap gap-3 p-4">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search trips…"
              className="pl-9 h-9 text-sm"
              disabled={isLoading}
            />
          </div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange} disabled={isLoading}>
            <SelectTrigger className="h-9 w-40 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="ASSIGNED">Assigned</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Only show agency filter for non-drivers */}
          {userRole !== 'driver' && (
            <Select value={agencyFilter} onValueChange={onAgencyFilterChange} disabled={isLoading}>
              <SelectTrigger className="h-9 w-44 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agencies</SelectItem>
                {agencies.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>
    </>
  )
}
