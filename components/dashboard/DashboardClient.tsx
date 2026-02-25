"use client";

import React from "react";
import {
  TrendingUp,
  Users,
  Truck,
  MapPin,
  DollarSign,
  Activity,
  Download,
} from "lucide-react";
import Link from "next/link";
import { trips, drivers, vehicles } from "@/lib/data";
import { exportToExcel } from "@/lib/utils/excel-export";

export function DashboardClient() {
  const handleExportTrips = () => {
    const todayTrips = trips.filter((t) => t.date === "2026-02-19");
    exportToExcel(todayTrips, "trips-today");
  };

  const totalTripsToday = trips.filter((t) => t.date === "2026-02-19").length;
  const activeDrivers = drivers.filter((d) => d.status !== "off-duty").length;
  const vehiclesInUse = vehicles.filter((v) => v.status === "in-use").length;
  const totalPax = trips
    .filter((t) => t.date === "2026-02-19")
    .reduce((sum, t) => sum + t.pax, 0);
  const totalDistance = trips
    .filter((t) => t.date === "2026-02-19")
    .reduce((sum, t) => sum + (t.kmEnd - t.kmStart), 0);
  const estimatedRevenue = totalTripsToday * 150;

  const stats = [
    {
      title: "Total Trips Today",
      value: totalTripsToday,
      icon: Activity,
      color: "bg-blue-100",
      textColor: "text-blue-600",
      borderColor: "border-l-blue-500",
    },
    {
      title: "Active Drivers",
      value: activeDrivers,
      icon: Users,
      color: "bg-green-100",
      textColor: "text-green-600",
      borderColor: "border-l-green-500",
    },
    {
      title: "Vehicles In Use",
      value: vehiclesInUse,
      icon: Truck,
      color: "bg-purple-100",
      textColor: "text-purple-600",
      borderColor: "border-l-purple-500",
    },
    {
      title: "Total Passengers",
      value: totalPax,
      icon: MapPin,
      color: "bg-orange-100",
      textColor: "text-orange-600",
      borderColor: "border-l-orange-500",
    },
    {
      title: "Total Distance",
      value: `${totalDistance} km`,
      icon: TrendingUp,
      color: "bg-indigo-100",
      textColor: "text-indigo-600",
      borderColor: "border-l-indigo-500",
    },
    {
      title: "Est. Revenue",
      value: `$${estimatedRevenue}`,
      icon: DollarSign,
      color: "bg-red-100",
      textColor: "text-red-600",
      borderColor: "border-l-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Operations overview for 2026-02-19
          </p>
        </div>
        <button onClick={handleExportTrips} className="export-btn">
          <Download className="w-4 h-4" />
          Export Today's Trips
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="stat-card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.textColor} mt-2`}>
                    {stat.value}
                  </p>
                </div>
                <div className="icon-bg ml-4">
                  <Icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Trips */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Trips
            </h2>
            <Link
              href="/trips"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {trips.slice(0, 5).map((trip) => (
              <div
                key={trip.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {trip.destination}
                  </p>
                  <p className="text-sm text-gray-600">
                    {trip.agency} → {trip.hotel}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      trip.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : trip.status === "in-progress"
                          ? "bg-purple-100 text-purple-800"
                          : trip.status === "assigned"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {trip.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Driver Status
            </h2>
            <Link
              href="/drivers"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {drivers.map((driver) => (
              <div
                key={driver.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {driver.name}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    driver.status === "available"
                      ? "bg-green-100 text-green-800"
                      : driver.status === "on-trip"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {driver.status === "on-trip"
                    ? "On Trip"
                    : driver.status === "off-duty"
                      ? "Off Duty"
                      : "Available"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { href: "/trips", label: "Manage Trips", icon: "📦" },
          { href: "/drivers", label: "Driver Management", icon: "👥" },
          { href: "/vehicles", label: "Fleet Management", icon: "🚗" },
          { href: "/reports", label: "View Reports", icon: "📊" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-3xl mb-2">{link.icon}</div>
            <p className="font-medium text-gray-900 text-sm">{link.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
