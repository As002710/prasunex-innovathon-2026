"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { Search, Bell, ArrowRight, LogOut } from "lucide-react";
import { useAuth, getDashboardPathForRole } from "@/context/AuthContext";

interface NavbarProps {
  onLogin?: () => void;
  user?: any;
  onBackToConsole?: () => void;
  onLogout?: () => void;
}

export function Navbar({ onLogin, user: propUser, onLogout: propLogout }: NavbarProps = {}) {
  const pathname = usePathname();
  const { user: authUser, logout: authLogout } = useAuth();
  const user = propUser || authUser;
  const onLogout = propLogout || authLogout;
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="relative z-50 w-full">
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-end gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        {pathname !== "/login" && (
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="relative hidden w-[min(30vw,380px)] min-w-[250px] md:block">
              <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4B6B5E]" />
              <input
                type="text"
                aria-label="Search CAMPUS-NEXUS"
                name="search"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-full border border-[#CDEBDD] bg-white/90 py-2 pl-9 pr-4 text-xs text-[#0B2E22] shadow-sm placeholder-[#7A968A] transition-all focus:border-[#34D399] focus:outline-none focus:ring-2 focus:ring-[#34D399]/30"
              />
            </div>

            <button
              aria-label="Notifications"
              className="relative shrink-0 rounded-full border border-[#CDEBDD] bg-[#F0FAF5] p-2 text-[#047857] shadow-sm transition-all hover:border-[#34D399] hover:text-[#065F46]"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">3</span>
            </button>

            {user ? (
              <div className="flex shrink-0 items-center gap-2">
                <Link href={getDashboardPathForRole(user.role)} className="flex items-center gap-1.5 rounded-xl bg-[#FACC15] px-3 py-2 text-xs font-bold text-[#0B2E22] shadow-sm transition-all hover:bg-[#EAB308] sm:px-4">
                  <span>Dashboard</span><ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button onClick={onLogout} aria-label="Log out" className="rounded-lg border border-[#CDEBDD] bg-[#F0FAF5] p-2 text-[#4B6B5E] transition-colors hover:border-red-300 hover:text-red-700" title="Sign out of CAMPUS-NEXUS">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              onLogin ? (
                <button onClick={onLogin} className="btn-gold-primary flex shrink-0 items-center gap-1.5 px-3 py-2 text-xs sm:px-5">
                  <span>Login</span><ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Link href="/login" className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#FACC15] px-3 py-2 text-xs font-bold text-[#0B2E22] shadow-sm transition-all hover:bg-[#EAB308] sm:px-5">
                  <span>Login</span><ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )
            )}
          </div>
        )}

        <div className="shrink-0 [&_img]:h-8 [&_img]:w-auto sm:[&_img]:h-10">
          <Logo showTagline={false} size="lg" />
        </div>
      </div>
    </header>
  );
}
