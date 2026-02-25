"use client";

import React from "react";
import { Plus, Truck, CheckCircle, Activity, DollarSign } from "lucide-react";
import { StatCard, PageHeader, VehicleStatusBadge } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { vehicles } from "@/lib/data";

export default function VehiclesPage() {
  const totalRent = vehicles.reduce((s, v) => s + v.monthlyRent, 0);

  return (
    <div>
      <PageHeader
        title="Fleet Management"
        subtitle="Monitor vehicles and operational costs"
        actions={
          <Button size="sm">
            <Plus className="size-4" /> Add Vehicle
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Vehicles"
          value={vehicles.length}
          icon={Truck}
          variant="default"
        />
        <StatCard
          label="Available"
          value={vehicles.filter((v) => v.status === "available").length}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          label="In Use"
          value={vehicles.filter((v) => v.status === "in-use").length}
          icon={Activity}
          variant="accent"
        />
        <StatCard
          label="Monthly Rent"
          value={`$${totalRent.toLocaleString()}`}
          icon={DollarSign}
          variant="warning"
          sub="total fleet"
        />
      </div>

      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {[
                  "Plate",
                  "Model",
                  "Owner",
                  "Driver",
                  "Capacity",
                  "KM Usage",
                  "Monthly Rent",
                  "SALIK",
                  "Last Service",
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
              {vehicles.map((v) => (
                <tr key={v.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-primary">
                    {v.plate}
                  </td>
                  <td className="px-4 py-3 font-semibold">{v.model}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {v.owner ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {v.driver ?? (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono">{v.capacity} pax</td>
                  <td className="px-4 py-3 font-mono">
                    {v.kmUsage.toLocaleString()} km
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold">
                    ${v.monthlyRent.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">${v.salik}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {v.lastMaintenance}
                  </td>
                  <td className="px-4 py-3">
                    <VehicleStatusBadge status={v.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
