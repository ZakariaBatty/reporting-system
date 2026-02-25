"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Star,
  Phone,
  Mail,
  Search,
  Users,
  CheckCircle,
  Activity,
} from "lucide-react";
import { useCrudState } from "@/hooks/useCrudState";
import { Drawer } from "@/components/Drawer";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { FormField } from "@/components/FormField";
import { Driver, drivers, DriverStatus, vehicles } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HoverCardContent } from "@/components/ui/hover-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/shared";

export default function DriversPage() {
  const [state, actions] = useCrudState<Driver>(drivers);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });

  const [formData, setFormData] = useState<Driver | null>(null);
  const [search, setSearch] = useState("");
  const filteredDrivers = state.items.filter((driver) => {
    const matchesStatus = !filters.status || driver.status === filters.status;
    const matchesSearch =
      !filters.search ||
      driver.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      driver.phone.includes(filters.search);
    return matchesStatus && matchesSearch;
  });

  const handleCreateDriver = () => {
    setFormData(null);
    actions.openCreateDrawer();
  };

  const handleEditDriver = (driver: Driver) => {
    setFormData({ ...driver });
    actions.openEditDrawer(driver);
  };

  const handleViewDriver = (driver: Driver) => {
    setFormData(driver);
    actions.openViewDrawer(driver);
  };

  const handleSaveDriver = () => {
    if (!formData) return;

    if (state.mode === "create") {
      const newDriver: Driver = {
        ...formData,
        id: String(Date.now()),
      };
      actions.createItem(newDriver);
    } else {
      actions.updateItem(formData);
    }
  };

  const handleDeleteDriver = (driver: Driver) => {
    actions.deleteItem(driver);
  };

  const avgRating = (
    drivers.reduce((s, d) => s + d.rating, 0) / drivers.length
  ).toFixed(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-l-4 border-green-500";
      case "on-trip":
        return "bg-purple-100 text-purple-800 border-l-4 border-purple-500";
      case "off-duty":
        return "bg-gray-100 text-gray-800 border-l-4 border-gray-500";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Driver Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all drivers in your fleet
          </p>
        </div>
        <button
          onClick={handleCreateDriver}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Driver
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Drivers"
          value={drivers.length}
          icon={Users}
          variant="default"
        />
        <StatCard
          label="Available"
          value={drivers.filter((d) => d.status === "available").length}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          label="On Trip"
          value={drivers.filter((d) => d.status === "on-trip").length}
          icon={Activity}
          variant="accent"
        />
        <StatCard
          label="Avg. Rating"
          value={avgRating}
          icon={Star}
          variant="warning"
          sub="out of 5.0"
        />
      </div>

      {/* Filters */}
      <Card className="mb-4 shadow-sm">
        <CardContent className="flex flex-wrap gap-3 p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drivers…"
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select
            value={filters.status}
            onValueChange={(v) =>
              setFilters({ ...filters, status: v as DriverStatus | "all" })
            }
          >
            <SelectTrigger className="h-9 w-40 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="on-trip">On Trip</SelectItem>
              <SelectItem value="off-duty">Off Duty</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="on-trip">On Trip</option>
            <option value="off-duty">Off Duty</option>
          </select>
          <button
            onClick={() =>
              setFilters({
                status: "",
                search: "",
              })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.length > 0 ? (
          filteredDrivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {driver.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(driver.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      {driver.rating}
                    </span>
                  </div>
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                    driver.status,
                  )}`}
                >
                  {driver.status === "on-trip" ? "On Trip" : driver.status}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  {driver.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  {driver.email}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4 py-4 border-y border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {driver.totalTrips}
                  </p>
                  <p className="text-xs text-gray-600">Trips</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {driver.totalKm}
                  </p>
                  <p className="text-xs text-gray-600">km</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">
                    {driver.vehicle || "-"}
                  </p>
                  <p className="text-xs text-gray-600">Vehicle</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDriver(driver)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handleEditDriver(driver)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => actions.openDeleteDialog(driver)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">
              No drivers found matching your filters.
            </p>
          </div>
        )}
      </div>

      {/* Driver Drawer */}
      <Drawer
        isOpen={state.isDrawerOpen}
        onClose={actions.closeDrawer}
        title={
          state.mode === "view"
            ? "Driver Details"
            : state.mode === "edit"
              ? "Edit Driver"
              : "Add New Driver"
        }
      >
        {state.mode === "view" && formData ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {formData.name}
              </h3>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(formData.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 font-semibold text-gray-900">
                  {formData.rating}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Contact Information
                </label>
                <div className="mt-2 space-y-2">
                  <p className="text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    {formData.phone}
                  </p>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-600" />
                    {formData.email}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status
                </label>
                <p
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(formData.status)}`}
                >
                  {formData.status === "on-trip" ? "On Trip" : formData.status}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Total Trips
                  </label>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {formData.totalTrips}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Total KM
                  </label>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {formData.totalKm}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Assigned Vehicle
                  </label>
                  <p className="text-lg font-bold text-purple-600 mt-1">
                    {formData.vehicle || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveDriver();
            }}
          >
            <FormField
              label="Full Name"
              value={formData?.name || ""}
              onChange={(val) =>
                setFormData({ ...formData!, name: String(val) })
              }
              placeholder="e.g., Ahmed Hassan"
            />
            <FormField
              label="Email"
              type="email"
              value={formData?.email || ""}
              onChange={(val) =>
                setFormData({ ...formData!, email: String(val) })
              }
              placeholder="e.g., ahmed@transithub.com"
            />
            <FormField
              label="Phone"
              type="tel"
              value={formData?.phone || ""}
              onChange={(val) =>
                setFormData({ ...formData!, phone: String(val) })
              }
              placeholder="+212 6 12 34 56 78"
            />
            <FormField
              label="Status"
              type="select"
              value={formData?.status || ""}
              onChange={(val) =>
                setFormData({ ...formData!, status: val as any })
              }
              options={[
                { value: "available", label: "Available" },
                { value: "on-trip", label: "On Trip" },
                { value: "off-duty", label: "Off Duty" },
              ]}
            />
            <FormField
              label="Assigned Vehicle"
              type="select"
              value={formData?.vehicle || ""}
              onChange={(val) =>
                setFormData({ ...formData!, vehicle: String(val) || undefined })
              }
              options={[
                { value: "", label: "No Vehicle" },
                ...vehicles.map((v) => ({
                  value: v.plate,
                  label: `${v.model} (${v.plate})`,
                })),
              ]}
            />
            <FormField
              label="Total Trips"
              type="number"
              value={String(formData?.totalTrips || "")}
              onChange={(val) =>
                setFormData({ ...formData!, totalTrips: Number(val) })
              }
            />
            <FormField
              label="Total KM"
              type="number"
              value={String(formData?.totalKm || "")}
              onChange={(val) =>
                setFormData({ ...formData!, totalKm: Number(val) })
              }
            />
            <FormField
              label="Rating (0-5)"
              type="number"
              value={String(formData?.rating || "")}
              onChange={(val) =>
                setFormData({ ...formData!, rating: Number(val) })
              }
            />
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={actions.closeDrawer}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {state.mode === "create" ? "Add Driver" : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={state.isDeleteDialogOpen}
        title="Delete Driver"
        message="Are you sure you want to delete this driver? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive
        onConfirm={() =>
          state.deleteTarget && handleDeleteDriver(state.deleteTarget)
        }
        onCancel={actions.closeDeleteDialog}
      />
    </div>
  );
}
