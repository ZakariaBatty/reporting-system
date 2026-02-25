"use client";

import React, { useState, useMemo } from "react";
import { Plus, Wrench, DollarSign, TrendingUp, Clock } from "lucide-react";
import {
  StatCard,
  PageHeader,
  MaintenanceTypeBadge,
  VehicleStatusBadge,
} from "@/components/shared";
import { FormField } from "@/components/FormField";
import { Drawer } from "@/components/Drawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  maintenanceRecords as initialRecords,
  vehicles,
  MaintenanceRecord,
  MaintenanceType,
} from "@/lib/data";

export default function MaintenancePage() {
  const [records, setRecords] = useState(initialRecords);
  const [filterType, setFilterType] = useState<MaintenanceType | "all">("all");
  const [filterVehicle, setFilterV] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({
    vehicleId: "",
    date: "",
    type: "oil-change" as MaintenanceType,
    cost: "",
    description: "",
    notes: "",
    nextDueDate: "",
  });

  const filtered = useMemo(
    () =>
      records.filter((m) => {
        if (filterType !== "all" && m.type !== filterType) return false;
        if (filterVehicle !== "all" && m.vehicleId !== filterVehicle)
          return false;
        return true;
      }),
    [records, filterType, filterVehicle],
  );

  const totalCost = records.reduce((s, m) => s + m.cost, 0);
  const upcoming = records.filter((m) => m.nextDueDate).length;
  const avgCost = Math.round(totalCost / records.length);

  const getVehicle = (id: string) => vehicles.find((v) => v.id === id);

  const handleSave = () => {
    const newRecord: MaintenanceRecord = {
      id: `M${Date.now()}`,
      vehicleId: form.vehicleId,
      date: form.date,
      type: form.type,
      cost: Number(form.cost),
      description: form.description,
      notes: form.notes || undefined,
      nextDueDate: form.nextDueDate || undefined,
    };
    setRecords([...records, newRecord]);
    setDrawerOpen(false);
    setForm({
      vehicleId: "",
      date: "",
      type: "oil-change",
      cost: "",
      description: "",
      notes: "",
      nextDueDate: "",
    });
  };

  return (
    <div>
      <PageHeader
        title="Maintenance"
        subtitle="Track fleet maintenance and service records"
        actions={
          <Button size="sm" onClick={() => setDrawerOpen(true)}>
            <Plus className="size-4" /> Log Maintenance
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Records"
          value={records.length}
          icon={Wrench}
          variant="default"
        />
        <StatCard
          label="Total Cost"
          value={`$${totalCost.toLocaleString()}`}
          icon={DollarSign}
          variant="danger"
          sub="maintenance spend"
        />
        <StatCard
          label="Avg. Cost"
          value={`$${avgCost}`}
          icon={TrendingUp}
          variant="warning"
          sub="per service"
        />
        <StatCard
          label="Upcoming Services"
          value={upcoming}
          icon={Clock}
          variant="purple"
          sub="scheduled next"
        />
      </div>

      {/* Per-vehicle summary cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {vehicles.map((v) => {
          const vRecords = records.filter((m) => m.vehicleId === v.id);
          const vCost = vRecords.reduce((s, m) => s + m.cost, 0);
          return (
            <Card key={v.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {v.model}
                    </p>
                    <p className="font-mono text-xs font-semibold text-primary">
                      {v.plate}
                    </p>
                  </div>
                  <VehicleStatusBadge status={v.status} />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-mono text-xl font-bold text-foreground">
                      {vRecords.length}
                    </p>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">
                      Services
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xl font-bold text-destructive">
                      ${vCost}
                    </p>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">
                      Total
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="mb-4 shadow-sm">
        <CardContent className="flex flex-wrap gap-3 p-4">
          <Select
            value={filterType}
            onValueChange={(v) => setFilterType(v as MaintenanceType | "all")}
          >
            <SelectTrigger className="h-9 w-48 text-sm">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="oil-change">Oil Change</SelectItem>
              <SelectItem value="inspection">Inspection</SelectItem>
              <SelectItem value="tire-replacement">Tire Replacement</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="brake-service">Brake Service</SelectItem>
              <SelectItem value="repair">Repair</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterVehicle} onValueChange={setFilterV}>
            <SelectTrigger className="h-9 w-52 text-sm">
              <SelectValue placeholder="All Vehicles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              {vehicles.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.plate} – {v.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="ml-auto flex items-center text-xs font-semibold text-muted-foreground">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""}
          </span>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {[
                  "ID",
                  "Vehicle",
                  "Date",
                  "Type",
                  "Description",
                  "Notes",
                  "Cost",
                  "Next Due",
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
                    colSpan={8}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No records found
                  </td>
                </tr>
              )}
              {filtered.map((m) => {
                const v = getVehicle(m.vehicleId);
                return (
                  <tr
                    key={m.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {m.id}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">
                        {v?.model}
                      </p>
                      <p className="font-mono text-xs text-primary">
                        {v?.plate}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{m.date}</td>
                    <td className="px-4 py-3">
                      <MaintenanceTypeBadge type={m.type} />
                    </td>
                    <td className="px-4 py-3 max-w-[180px] truncate">
                      {m.description}
                    </td>
                    <td className="px-4 py-3 max-w-[150px] truncate text-xs text-muted-foreground">
                      {m.notes ?? "—"}
                    </td>
                    <td
                      className="px-4 py-3 font-mono font-bold"
                      style={{
                        color:
                          m.cost > 500 ? "hsl(var(--destructive))" : undefined,
                      }}
                    >
                      ${m.cost}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-amber-600">
                      {m.nextDueDate ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Log Maintenance Record"
      >
        <FormField
          label="Vehicle"
          value={form.vehicleId}
          onChange={(v) => setForm({ ...form, vehicleId: v })}
          as="select"
          options={[
            { value: "", label: "Select vehicle" },
            ...vehicles.map((v) => ({
              value: v.id,
              label: `${v.plate} – ${v.model}`,
            })),
          ]}
        />
        <FormField
          label="Date"
          value={form.date}
          onChange={(v) => setForm({ ...form, date: v })}
          type="date"
        />
        <FormField
          label="Type"
          value={form.type}
          onChange={(v) => setForm({ ...form, type: v as MaintenanceType })}
          as="select"
          options={[
            { value: "oil-change", label: "Oil Change" },
            { value: "inspection", label: "Inspection" },
            { value: "tire-replacement", label: "Tire Replacement" },
            { value: "service", label: "Service" },
            { value: "brake-service", label: "Brake Service" },
            { value: "repair", label: "Repair" },
          ]}
        />
        <FormField
          label="Cost ($)"
          value={form.cost}
          onChange={(v) => setForm({ ...form, cost: v })}
          type="number"
          placeholder="0"
        />
        <FormField
          label="Description"
          value={form.description}
          onChange={(v) => setForm({ ...form, description: v })}
          placeholder="What was done?"
        />
        <FormField
          label="Notes (optional)"
          value={form.notes}
          onChange={(v) => setForm({ ...form, notes: v })}
          placeholder="Additional details"
        />
        <FormField
          label="Next Due Date"
          value={form.nextDueDate}
          onChange={(v) => setForm({ ...form, nextDueDate: v })}
          type="date"
        />
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave} className="flex-1">
            Save Record
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
