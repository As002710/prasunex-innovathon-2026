"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, getDashboardPathForRole } from "@/context/AuthContext";

export default function DashboardRedirect() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.replace("/login?redirect=/dashboard");
      } else {
        router.replace(getDashboardPathForRole(user.role));
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-darkEmerald-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-mint-400">
        <div className="w-8 h-8 border-2 border-mint-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs tracking-wider uppercase font-medium text-mint-300">
          Routing to your dashboard...
        </p>
      </div>
    </div>
  );
}
