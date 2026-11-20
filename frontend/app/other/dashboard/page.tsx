"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OtherDashboardView } from "@/components/OtherDashboardView";

export default function OtherDashboardPage() {
  return (
    <ProtectedRoute
      allowedRoles={[
        "other",
        "technician",
        "warden",
        "technician_warden",
        "recruiter",
        "staff",
        "guest",
        "alumni",
      ]}
    >
      <OtherDashboardView />
    </ProtectedRoute>
  );
}
