"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FacultyDashboardView } from "@/components/FacultyDashboardView";

export default function FacultyDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["faculty", "professor", "hod", "professor_hod"]}>
      <FacultyDashboardView />
    </ProtectedRoute>
  );
}
