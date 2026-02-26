"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  getTripsAction,
  createTripAction,
  updateTripAction,
  deleteTripAction,
  getTripStatsAction,
  getTotalPassengersAction,
  getReferenceDataAction,
} from "@/lib/trips/actions/trip.actions";
import { TripsHeader } from "./TripsHeader";
import { TripsList } from "./TripsList";
import { TripsFormDrawer } from "./TripsFormDrawer";

interface TripData {
  id: string;
  tripDate: string | Date;
  departureTime: string;
  estimatedArrivalTime?: string | null;
  pickupLocation: string;
  dropoffLocation: string;
  destination: string;
  driver: { user: { id: string; name: string; email: string } };
  vehicle: { id: string; plate: string; model: string };
  agency: { id: string; name: string };
  hotel: { id: string; name: string };
  passengersCount: number;
  kmStart: number;
  kmEnd?: number | null;
  type: "OUT" | "IN";
  status: string;
}

export function TripsContainer() {
  const { data: session } = useSession();
  const [trips, setTrips] = useState<TripData[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [totalPassengers, setTotalPassengers] = useState<number | null>(null);
  const [referenceData, setReferenceData] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [agencyFilter, setAgencyFilter] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const userRole = (session?.user as any)?.role || "DRIVER";
  const userId = session?.user?.id || "";

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      if (!session?.user?.id) return;

      setIsLoading(true);
      try {
        const [tripsRes, statsRes, passengersRes, refDataRes] =
          await Promise.all([
            getTripsAction(),
            getTripStatsAction(),
            getTotalPassengersAction(),
            getReferenceDataAction(),
          ]);

        if (tripsRes.success) setTrips(tripsRes.data || []);
        if (statsRes.success) setStats(statsRes.data);
        if (passengersRes.success) setTotalPassengers(passengersRes.data);
        if (refDataRes.success) setReferenceData(refDataRes.data);
      } catch (error) {
        console.error("Error loading trips data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [session]);

  // Filter trips
  const filteredTrips = useMemo(() => {
    return trips.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (agencyFilter !== "all" && t.agency.id !== agencyFilter) return false;
      if (
        search &&
        ![
          t.destination,
          t.driver.user.name,
          t.hotel.name,
          t.agency.name,
          t.pickupLocation,
        ].some((v) => v.toLowerCase().includes(search.toLowerCase()))
      )
        return false;
      return true;
    });
  }, [trips, statusFilter, agencyFilter, search]);

  // Handle create trip
  const handleCreate = useCallback(async (formData: any) => {
    setIsSaving(true);
    try {
      const res = await createTripAction(formData);
      if (res.success) {
        setTrips((prev: any[]) => [res.data, ...prev]);
        // Refetch stats
        const statsRes = await getTripStatsAction();
        if (statsRes.success) setStats(statsRes.data);
        const passengersRes = await getTotalPassengersAction();
        if (passengersRes.success) setTotalPassengers(passengersRes.data);
      } else {
        alert(`Error: ${res.error}`);
      }
    } catch (error) {
      console.error("Error creating trip:", error);
      alert("Failed to create trip");
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Handle update trip
  const handleUpdate = useCallback(
    async (formData: any) => {
      if (!selectedTrip) return;

      setIsSaving(true);
      try {
        const res = await updateTripAction(selectedTrip.id, formData);
        if (res.success) {
          setTrips((prev: any[]) =>
            prev.map((t) => (t.id === selectedTrip.id ? res.data : t)),
          );
          setSelectedTrip(null);
          // Refetch stats
          const statsRes = await getTripStatsAction();
          if (statsRes.success) setStats(statsRes.data);
          const passengersRes = await getTotalPassengersAction();
          if (passengersRes.success) setTotalPassengers(passengersRes.data);
        } else {
          alert(`Error: ${res.error}`);
        }
      } catch (error) {
        console.error("Error updating trip:", error);
        alert("Failed to update trip");
      } finally {
        setIsSaving(false);
      }
    },
    [selectedTrip],
  );

  // Handle delete trip
  const handleDelete = useCallback(async (tripId: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;

    setIsDeleting(true);
    try {
      const res = await deleteTripAction(tripId);
      if (res.success) {
        setTrips((prev) => prev.filter((t) => t.id !== tripId));
        // Refetch stats
        const statsRes = await getTripStatsAction();
        if (statsRes.success) setStats(statsRes.data);
        const passengersRes = await getTotalPassengersAction();
        if (passengersRes.success) setTotalPassengers(passengersRes.data);
      } else {
        alert(`Error: ${res.error}`);
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
      alert("Failed to delete trip");
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // Handle drawer open for create
  const handleOpenCreate = () => {
    setSelectedTrip(null);
    setDrawerOpen(true);
  };

  // Handle drawer open for edit
  const handleOpenEdit = (trip: TripData) => {
    setSelectedTrip(trip);
    setDrawerOpen(true);
  };

  // Handle drawer close
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedTrip(null);
  };

  // Handle form submit
  const handleFormSubmit = async (formData: any) => {
    if (selectedTrip) {
      await handleUpdate(formData);
    } else {
      await handleCreate(formData);
    }
    handleCloseDrawer();
  };

  return (
    <div className="space-y-6">
      <TripsHeader
        stats={stats}
        totalPassengers={totalPassengers}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        agencyFilter={agencyFilter}
        onAgencyFilterChange={setAgencyFilter}
        agencies={referenceData?.agencies || []}
        onCreateNew={handleOpenCreate}
        userRole={userRole}
      />

      <TripsList
        trips={filteredTrips}
        userRole={userRole}
        userId={userId}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      <TripsFormDrawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        trip={selectedTrip as any}
        agencies={referenceData?.agencies || []}
        hotels={referenceData?.hotels || []}
        drivers={referenceData?.drivers || []}
        vehicles={referenceData?.vehicles || []}
        userRole={userRole}
        onSubmit={handleFormSubmit}
        isLoading={isSaving}
      />
    </div>
  );
}
