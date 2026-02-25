"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  Activity,
} from "lucide-react";
import {
  StatCard,
  PageHeader,
  TripStatusBadge,
  TripTypeBadge,
} from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trips } from "@/lib/data";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1));
  const [selectedDate, setSelectedDate] = useState<string>("2026-02-19");

  const getDaysInMonth = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const getFirstDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), 1).getDay();
  const formatDate = (day: number) => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return d.toISOString().split("T")[0];
  };

  const getTripsForDate = (dateStr: string) =>
    trips.filter((t) => t.date === dateStr);
  const getTripCount = (dateStr: string) => getTripsForDate(dateStr).length;

  const days = [
    ...Array(getFirstDay(currentDate)).fill(null),
    ...Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1),
  ];
  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const selectedTrips = selectedDate ? getTripsForDate(selectedDate) : [];
  const tripCountMonth = trips.filter((t) =>
    t.date.startsWith(`2026-0${currentDate.getMonth() + 1}`),
  ).length;
  const totalPaxMonth = trips
    .filter((t) => t.date.startsWith(`2026-0${currentDate.getMonth() + 1}`))
    .reduce((s, t) => s + t.pax, 0);

  const getCellClass = (count: number, isSelected: boolean) => {
    const base =
      "flex flex-col items-center justify-center rounded-xl border p-2 text-center cursor-pointer transition-all select-none min-h-[56px]";
    if (isSelected)
      return cn(
        base,
        "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-sm",
      );
    if (count === 0)
      return cn(base, "border-border bg-background hover:bg-muted/50");
    if (count <= 2)
      return cn(base, "border-blue-200 bg-blue-50 hover:bg-blue-100");
    if (count <= 5)
      return cn(base, "border-blue-300 bg-blue-200 hover:bg-blue-300");
    return cn(base, "border-blue-500 bg-blue-500 hover:bg-blue-600");
  };

  return (
    <div>
      <PageHeader
        title="Calendar View"
        subtitle="Track operations and scheduling by date"
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Month Trips"
          value={tripCountMonth}
          sub={monthName}
          icon={Calendar}
          variant="default"
        />
        <StatCard
          label="Month PAX"
          value={totalPaxMonth}
          sub="transported"
          icon={Users}
          variant="success"
        />
        <StatCard
          label="Selected Date"
          value={selectedDate || "—"}
          sub="click a date"
          icon={MapPin}
          variant="accent"
        />
        <StatCard
          label="Day Trips"
          value={selectedTrips.length}
          sub="on selected day"
          icon={Activity}
          variant="purple"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold">{monthName}</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    setCurrentDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() - 1,
                      ),
                    )
                  }
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    setCurrentDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() + 1,
                      ),
                    )
                  }
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
            {/* Legend */}
            <div className="mt-3 flex flex-wrap gap-4">
              {[
                ["No trips", "bg-background border-border"],
                ["1-2 trips", "bg-blue-50 border-blue-200"],
                ["3-5 trips", "bg-blue-200 border-blue-300"],
                ["6+ trips", "bg-blue-500 border-blue-500"],
              ].map(([label, cls]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={cn("h-3.5 w-3.5 rounded border", cls)} />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {/* Weekday headers */}
            <div className="mb-2 grid grid-cols-7 gap-1.5">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="py-1 text-center text-[11px] font-bold uppercase text-muted-foreground"
                >
                  {d}
                </div>
              ))}
            </div>
            {/* Days */}
            <div className="grid grid-cols-7 gap-1.5">
              {days.map((day, i) => {
                if (!day) return <div key={`e${i}`} />;
                const dateStr = formatDate(day);
                const count = getTripCount(dateStr);
                const selected = selectedDate === dateStr;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={getCellClass(count, selected)}
                  >
                    <span
                      className={cn(
                        "text-sm font-bold",
                        count >= 6 ? "text-white" : "text-foreground",
                      )}
                    >
                      {day}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 text-[10px] font-semibold",
                        count >= 6
                          ? "text-white/80"
                          : count > 0
                            ? "text-blue-700"
                            : "text-muted-foreground",
                      )}
                    >
                      {count > 0 ? count : "·"}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Detail panel */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-sm font-bold">
              {selectedDate || "Select a date"}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {selectedTrips.length} trip{selectedTrips.length !== 1 ? "s" : ""}{" "}
              scheduled
            </p>
          </CardHeader>
          <CardContent className="p-4">
            {selectedTrips.length > 0 ? (
              <>
                {/* Summary row */}
                <div className="mb-4 grid grid-cols-3 divide-x divide-border overflow-hidden rounded-xl border border-border">
                  {[
                    { label: "Trips", value: selectedTrips.length },
                    {
                      label: "PAX",
                      value: selectedTrips.reduce((s, t) => s + t.pax, 0),
                    },
                    {
                      label: "KM",
                      value: selectedTrips.reduce(
                        (s, t) => s + (t.kmEnd - t.kmStart),
                        0,
                      ),
                    },
                  ].map((s) => (
                    <div key={s.label} className="p-3 text-center">
                      <p className="font-mono text-xl font-bold text-primary">
                        {s.value}
                      </p>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {selectedTrips.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-xl border border-border p-3 transition-colors hover:bg-muted/30"
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-foreground">
                          {t.destination}
                        </p>
                        <span className="font-mono text-xs font-bold text-muted-foreground">
                          {t.time}
                        </span>
                      </div>
                      <p className="mb-2 text-xs text-muted-foreground">
                        {t.agency} · {t.driver} · {t.pax} pax
                      </p>
                      <div className="flex items-center gap-2">
                        <TripStatusBadge status={t.status} />
                        <TripTypeBadge type={t.type} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="mb-3 size-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No trips on this date
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
