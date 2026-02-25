"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  MapPin,
  CheckCircle,
  Activity,
  Users,
} from "lucide-react";
import {
  StatCard,
  PageHeader,
  TripStatusBadge,
  TripTypeBadge,
} from "@/components/shared";
import { FormField } from "@/components/FormField";
import { Drawer } from "@/components/Drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  trips as initialTrips,
  agencies,
  drivers,
  TripStatus,
  TripType,
} from "@/lib/data";

export function TripsClient() {
  const [tripList, setTripList] = useState(initialTrips);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState<TripStatus | "all">("all");
  const [agencyFilter, setAgency] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({
    date: "",
    time: "",
    agency: "",
    hotel: "",
    destination: "",
    driver: "",
    vehicle: "",
    pax: "",
    type: "OUT" as TripType,
    status: "scheduled" as TripStatus,
    notes: "",
  });

  const filtered = useMemo(
    () =>
      tripList.filter((t) => {
        if (statusFilter !== "all" && t.status !== statusFilter) return false;
        if (agencyFilter !== "all" && t.agency !== agencyFilter) return false;
        if (
          search &&
          ![t.destination, t.driver, t.hotel, t.agency].some((v) =>
            v.toLowerCase().includes(search.toLowerCase()),
          )
        )
          return false;
        return true;
      }),
    [tripList, statusFilter, agencyFilter, search],
  );

  const handleSave = () => {
    setTripList([
      ...tripList,
      {
        ...form,
        id: String(Date.now()),
        pax: Number(form.pax),
        kmStart: 0,
        kmEnd: 0,
      },
    ]);
    setDrawerOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Trips Management"
        subtitle="Manage and monitor all transportation operations"
        actions={
          <Button onClick={() => setDrawerOpen(true)} size="sm">
            <Plus className="size-4" /> New Trip
          </Button>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Trips"
          value={tripList.length}
          icon={MapPin}
          variant="default"
        />
        <StatCard
          label="Completed"
          value={tripList.filter((t) => t.status === "completed").length}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          label="In Progress"
          value={tripList.filter((t) => t.status === "in-progress").length}
          icon={Activity}
          variant="accent"
        />
        <StatCard
          label="Total Passengers"
          value={tripList.reduce((s, t) => s + t.pax, 0)}
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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trips…"
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatus(v as TripStatus | "all")}
          >
            <SelectTrigger className="h-9 w-40 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
            </SelectContent>
          </Select>
          <Select value={agencyFilter} onValueChange={setAgency}>
            <SelectTrigger className="h-9 w-44 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agencies</SelectItem>
              {agencies.map((a) => (
                <SelectItem key={a.id} value={a.name}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {[
                  "Date",
                  "Time",
                  "Agency",
                  "Hotel",
                  "Destination",
                  "Driver",
                  "PAX",
                  "Dist.",
                  "Type",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-2.5 text-left"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No trips found
                  </td>
                </tr>
              )}
              {filtered.map((t) => (
                <tr key={t.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{t.date}</td>
                  <td className="px-4 py-3 font-mono text-xs font-bold">
                    {t.time}
                  </td>
                  <td className="px-4 py-3 font-semibold">{t.agency}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.hotel}</td>
                  <td className="px-4 py-3">{t.destination}</td>
                  <td className="px-4 py-3">{t.driver}</td>
                  <td className="px-4 py-3 font-mono">{t.pax}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {t.kmEnd - t.kmStart} km
                  </td>
                  <td className="px-4 py-3">
                    <TripTypeBadge type={t.type} />
                  </td>
                  <td className="px-4 py-3">
                    <TripStatusBadge status={t.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Add New Trip"
      >
        <FormField
          label="Date"
          value={form.date}
          onChange={(v) => setForm({ ...form, date: v })}
          type="date"
        />
        <FormField
          label="Time"
          value={form.time}
          onChange={(v) => setForm({ ...form, time: v })}
          type="time"
        />
        <FormField
          label="Agency"
          value={form.agency}
          onChange={(v) => setForm({ ...form, agency: v })}
          placeholder="Agency name"
        />
        <FormField
          label="Hotel"
          value={form.hotel}
          onChange={(v) => setForm({ ...form, hotel: v })}
          placeholder="Pick-up hotel"
        />
        <FormField
          label="Destination"
          value={form.destination}
          onChange={(v) => setForm({ ...form, destination: v })}
          placeholder="Destination"
        />
        <FormField
          label="Driver"
          value={form.driver}
          onChange={(v) => setForm({ ...form, driver: v })}
          as="select"
          options={[
            { value: "", label: "Select driver" },
            ...drivers.map((d) => ({ value: d.name, label: d.name })),
          ]}
        />
        <FormField
          label="Passengers"
          value={form.pax}
          onChange={(v) => setForm({ ...form, pax: v })}
          type="number"
          placeholder="0"
        />
        <FormField
          label="Type"
          value={form.type}
          onChange={(v) => setForm({ ...form, type: v as TripType })}
          as="select"
          options={[
            { value: "OUT", label: "OUT (Hotel → Destination)" },
            { value: "IN", label: "IN (Destination → Hotel)" },
          ]}
        />
        <FormField
          label="Notes"
          value={form.notes}
          onChange={(v) => setForm({ ...form, notes: v })}
          placeholder="Optional notes"
        />
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave} className="flex-1">
            Save Trip
          </Button>
          <Button
            onClick={() => setDrawerOpen(false)}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
