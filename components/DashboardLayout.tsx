"use client";

import React, { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { Menu } from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:shrink-0 border-r border-gray-200 bg-white">
        <AppSidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar Panel */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white z-40 md:hidden shadow-xl">
            <AppSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Topbar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-lg text-gray-900">TransitHub</h1>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <main className="p-6 md:p-8 w-full h-full">{children}</main>
        </div>
      </div>
    </div>
  );
}
