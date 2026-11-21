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
    <div className="relative z-10 max-w-lg w-full p-8 rounded-3xl bg-burgundy-900/90 border border-gold-500/40 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.2)] text-center space-y-6">
      {/* Icon Badge */}
      <div className="mx-auto w-16 h-16 rounded-2xl bg-gold-500/15 border border-gold-400/50 flex items-center justify-center text-gold-400 shadow-[0_0_25px_rgba(212,175,55,0.35)]">
        <ShieldAlert className="w-8 h-8 stroke-[2.2]" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold tracking-widest text-gold-400 uppercase block">
          HTTP 403 · FORBIDDEN
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Access Denied
        </h1>
        <p className="text-sm text-gold-100/80 leading-relaxed max-w-md mx-auto">
          You do not have the required permissions to view this page. This area
          is restricted to <span className="text-gold-300 font-bold uppercase">{required}</span>.
        </p>
      </div>

      {/* Role Comparison Card */}
      <div className="p-4 rounded-xl bg-burgundy-950/90 border border-gold-500/25 text-xs flex items-center justify-between gap-4">
        <div className="text-left">
          <span className="text-[10px] uppercase font-bold text-gold-200/60 block">
            Your Active Role
          </span>
          <span className="text-sm font-extrabold text-white capitalize">
            {currentRole}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-gold-200/60 block">
            Required Role
          </span>
          <span className="text-sm font-extrabold text-coral capitalize">
            {required}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Link
          href={userDashboard}
          className="w-full btn-gold-primary py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.35)]"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Go to My Dashboard</span>
        </Link>
        <button
          onClick={logout}
          className="w-full py-3 rounded-full text-xs font-semibold text-gold-200/80 hover:text-white bg-burgundy-800/80 hover:bg-burgundy-700 border border-gold-500/30 transition-all flex items-center justify-center gap-2"
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
    <div className="min-h-screen bg-burgundy-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-15 bg-center bg-cover mix-blend-screen"
          style={{ backgroundImage: `url('/images/campus-night.svg')` }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gold-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Logo */}
      <div className="absolute top-8 left-8 z-20">
        <Logo size="md" showTagline={false} />
      </div>

      <Suspense fallback={
        <div className="text-xs text-gold-200/60 animate-pulse">Loading authorization details…</div>
      }>
        <ForbiddenContent />
      </Suspense>
    </div>
  );
}
