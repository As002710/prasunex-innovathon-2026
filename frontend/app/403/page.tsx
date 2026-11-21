"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldAlert, ArrowRight, LogOut, LayoutDashboard, Lock } from "lucide-react";
import { useAuth, getDashboardPathForRole, normalizeRole } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";

function ForbiddenContent() {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  const required = searchParams.get("required") || "Authorized Role";
  const currentRole = user?.role || searchParams.get("current") || "Guest";

  const userDashboard = getDashboardPathForRole(user?.role);

  return (
    <div className="relative z-10 max-w-lg w-full p-8 rounded-xl bg-[#F0FAF5] border border-[#CDEBDD] shadow-[0_1px_2px_rgba(11,46,34,0.06)] text-center space-y-6">
      {/* Icon Badge */}
      <div className="mx-auto w-16 h-16 rounded-2xl bg-white border border-[#CDEBDD] flex items-center justify-center text-[#B91C1C] shadow-sm">
        <ShieldAlert className="w-8 h-8 stroke-[2.2]" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold tracking-widest text-[#B91C1C] uppercase block">
          HTTP 403 · FORBIDDEN
        </span>
        <h1 className="text-3xl font-black text-[#0B2E22] tracking-tight">
          Access Denied
        </h1>
        <p className="text-sm text-[#4B6B5E] leading-relaxed max-w-md mx-auto">
          You do not have the required permissions to view this page. This area
          is restricted to <span className="text-[#0B2E22] font-bold uppercase">{required}</span>.
        </p>
      </div>

      {/* Role Comparison Card */}
      <div className="p-4 rounded-xl bg-white border border-[#CDEBDD] text-xs flex items-center justify-between gap-4">
        <div className="text-left">
          <span className="text-[10px] uppercase font-bold text-[#4B6B5E] block">
            Your Active Role
          </span>
          <span className="text-sm font-extrabold text-[#0B2E22] capitalize">
            {currentRole}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-[#4B6B5E] block">
            Required Role
          </span>
          <span className="text-sm font-extrabold text-[#B91C1C] capitalize">
            {required}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Link
          href={userDashboard}
          className="w-full py-3 rounded-xl text-xs font-bold bg-[#FACC15] hover:bg-[#EAB308] text-[#0B2E22] flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Go to My Dashboard</span>
        </Link>
        <button
          onClick={logout}
          className="w-full py-3 rounded-xl text-xs font-semibold text-[#0B2E22] hover:bg-white bg-[#F0FAF5] border border-[#CDEBDD] transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Switch Account</span>
        </button>
      </div>
    </div>
  );
}

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-white text-[#0B2E22] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Top Logo */}
      <div className="absolute top-8 left-8 z-20">
        <Logo size="md" showTagline={false} />
      </div>

      <Suspense fallback={
        <div className="text-xs text-[#4B6B5E] animate-pulse">Loading authorization details…</div>
      }>
        <ForbiddenContent />
      </Suspense>
    </div>
  );
}
