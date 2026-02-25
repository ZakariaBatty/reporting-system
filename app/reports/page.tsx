"use client";

import { Download, TrendingUp, Users, DollarSign, Truck } from "lucide-react";
import { trips, drivers, vehicles, agencies } from "@/lib/data/indexold";

export default function ReportsPage() {
  const totalTrips = trips.length;
  const totalRevenue = agencies.reduce((sum, a) => sum + a.revenue, 0);
  const totalPax = trips.reduce((sum, t) => sum + t.pax, 0);
  const totalDistance = trips.reduce(
    (sum, t) => sum + (t.kmEnd - t.kmStart),
    0,
  );

  const tripsPerDay = trips.reduce(
    (acc, trip) => {
      const existing = acc.find((t) => t.date === trip.date);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ date: trip.date, count: 1 });
      }
      return acc;
    },
    [] as Array<{ date: string; count: number }>,
  );

  const driverPerformance = drivers.map((driver) => ({
    name: driver.name,
    trips: driver.totalTrips,
    km: driver.totalKm,
    rating: driver.rating,
  }));

  const agencyContribution = agencies.map((agency) => ({
    name: agency.name,
    trips: agency.totalTrips,
    revenue: agency.revenue,
  }));

  const stats = [
    {
      title: "Total Trips",
      value: totalTrips,
      icon: Truck,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue}`,
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Passengers",
      value: totalPax,
      icon: Users,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Total Distance",
      value: `${totalDistance} km`,
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            View comprehensive operations analytics and performance metrics
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`${stat.color} rounded-lg p-6 border border-gray-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <Icon className="w-10 h-10 opacity-30" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trips Per Day */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Trips Per Day
          </h2>
          <div className="space-y-3">
            {tripsPerDay.map((data) => (
              <div
                key={data.date}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-600">{data.date}</span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 bg-blue-500 rounded"
                    style={{ width: `${data.count * 30}px` }}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {data.count} trips
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Drivers
          </h2>
          <div className="space-y-4">
            {driverPerformance
              .sort((a, b) => b.trips - a.trips)
              .slice(0, 5)
              .map((driver) => (
                <div
                  key={driver.name}
                  className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {driver.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {driver.km} km • Rating: {driver.rating}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    {driver.trips} trips
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Agency Contribution */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Agency Contribution
          </h2>
          <div className="space-y-4">
            {agencyContribution.map((agency) => {
              const maxRevenue = Math.max(
                ...agencyContribution.map((a) => a.revenue),
              );
              const percentage = (agency.revenue / maxRevenue) * 100;
              return (
                <div key={agency.name} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">
                        {agency.name}
                      </p>
                      <span className="text-xs text-gray-600">
                        ${agency.revenue}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {agency.trips} trips
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vehicle Usage */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Fleet Utilization
          </h2>
          <div className="space-y-4">
            {vehicles.slice(0, 5).map((vehicle) => (
              <div key={vehicle.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {vehicle.plate}
                  </p>
                  <p className="text-xs text-gray-600">{vehicle.model}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">
                    {vehicle.kmUsage} km
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      vehicle.status === "available"
                        ? "text-green-600"
                        : vehicle.status === "in-use"
                          ? "text-blue-600"
                          : "text-red-600"
                    }`}
                  >
                    {vehicle.status.replace("-", " ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Summary
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-blue-600 font-medium">Avg Trips/Day</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {Math.ceil(totalTrips / tripsPerDay.length) || 0}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-xs text-green-600 font-medium">
                Avg Revenue/Day
              </p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                ${Math.ceil(totalRevenue / tripsPerDay.length) || 0}
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-xs text-orange-600 font-medium">
                Avg Passengers/Trip
              </p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                {Math.ceil(totalPax / totalTrips) || 0}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-xs text-purple-600 font-medium">
                Avg Distance/Trip
              </p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {Math.ceil(totalDistance / totalTrips) || 0} km
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Trip History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Agency
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Driver
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Pax
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Distance
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trips.slice(0, 10).map((trip) => (
                <tr key={trip.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{trip.date}</td>
                  <td className="px-4 py-3 text-gray-900">{trip.agency}</td>
                  <td className="px-4 py-3 text-gray-900">{trip.driver}</td>
                  <td className="px-4 py-3 text-gray-900">{trip.pax}</td>
                  <td className="px-4 py-3 text-gray-900">
                    {trip.kmEnd - trip.kmStart} km
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        trip.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : trip.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
