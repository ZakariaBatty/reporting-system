"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { DashboardLayout } from "./DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";

const AUTH_ROUTES = [
  "/auth/login",
  "/auth/forgot-password",
  "/auth/verify-code",
  "/auth/reset-password",
];

export function RootLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  return (
    <AuthProvider>
      {isAuthRoute ? (
        children
      ) : (
        <ProtectedRoute>
          <DashboardLayout>{children}</DashboardLayout>
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}
