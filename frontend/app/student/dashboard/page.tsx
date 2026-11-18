"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { EnhancedStudentDashboardView } from "@/components/EnhancedStudentDashboardView";

export default function StudentDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <EnhancedStudentDashboardView embedded={false} />
    </ProtectedRoute>
  );
}
