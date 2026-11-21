"use client";

import React, { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, normalizeRole } from "@/context/AuthContext";
import { ShieldCheck, Sparkles } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      const userNorm = normalizeRole(user.role);
      const isAllowed = allowedRoles.some((r) => {
        const normTarget = normalizeRole(r);
        return normTarget === userNorm || r.toLowerCase() === user.role.toLowerCase();
      });

      if (!isAllowed) {
        router.replace(`/403?required=${allowedRoles.join(",")}&current=${user.role}`);
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-[#0B2E22] space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#F0FAF5] border border-[#CDEBDD] flex items-center justify-center animate-pulse shadow-sm">
          <Sparkles className="w-6 h-6 text-[#047857] animate-spin" />
        </div>
        <p className="text-xs font-semibold text-[#4B6B5E] tracking-wider uppercase">
          Verifying Campus Credentials…
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userNorm = normalizeRole(user.role);
    const isAllowed = allowedRoles.some((r) => {
      const normTarget = normalizeRole(r);
      return normTarget === userNorm || r.toLowerCase() === user.role.toLowerCase();
    });

    if (!isAllowed) {
      return null;
    }
  }

  return <>{children}</>;
}
