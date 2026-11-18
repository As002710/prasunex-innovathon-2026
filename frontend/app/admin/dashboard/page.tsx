"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminDashboardView } from "@/components/AdminDashboardView";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "dean", "chancellor_dean"]}>
      <AdminDashboardView />
    </ProtectedRoute>
  );
}
