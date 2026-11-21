"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { Search, Bell, ChevronDown, ArrowRight, Menu, X, LogOut } from "lucide-react";
import { useAuth, getDashboardPathForRole } from "@/context/AuthContext";

interface NavbarProps {
  onLogin?: () => void;
  user?: any;
  onBackToConsole?: () => void;
  onLogout?: () => void;
}

export function Navbar({ onLogin, user: propUser, onBackToConsole, onLogout: propLogout }: NavbarProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user: authUser, logout: authLogout } = useAuth();
  const user = propUser || authUser;
  const onLogout = propLogout || authLogout;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-burgundy-950/85 border-b border-gold-500/30 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Menu + Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-burgundy-900/80 border border-gold-500/30 text-gold-400"
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-shrink-0">
            <Logo size="md" />
          </div>
        </div>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-[#F0FAF5] p-1.5 rounded-full border border-[#CDEBDD]">
          {/* Home Active Pill */}
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              pathname === "/"
                ? "bg-[#34D399] text-[#0B2E22] font-bold shadow-sm"
                : "text-[#4B6B5E] hover:text-[#0B2E22] hover:bg-white"
            }`}
          >
            Home
          </Link>

          {/* Features */}
          <a
            href="#features"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-[#4B6B5E] hover:text-[#0B2E22] hover:bg-white transition-all"
          >
            Features <ChevronDown className="w-3 h-3 text-[#4B6B5E]" />
          </a>

          {/* Portals */}
          <a
            href="#portals"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-[#4B6B5E] hover:text-[#0B2E22] hover:bg-white transition-all"
          >
            Portals <ChevronDown className="w-3 h-3 text-[#4B6B5E]" />
          </a>

          {/* AI Insights */}
          <a
            href="#insights"
            className="px-3 py-1.5 rounded-full text-xs font-medium text-[#4B6B5E] hover:text-[#0B2E22] hover:bg-white transition-all"
          >
            AI Insights
          </a>

          {/* About */}
          <a
            href="#about"
            className="px-3 py-1.5 rounded-full text-xs font-medium text-[#4B6B5E] hover:text-[#0B2E22] hover:bg-white transition-all"
          >
            About
          </a>

          {/* Resources */}
          <a
            href="#resources"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-[#4B6B5E] hover:text-[#0B2E22] hover:bg-white transition-all"
          >
            Resources <ChevronDown className="w-3 h-3 text-[#4B6B5E]" />
          </a>
        </nav>

        {/* Right: Search Box + Bell + Login CTA */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative hidden md:block w-64 lg:w-72">
            <Search className="w-3.5 h-3.5 text-[#4B6B5E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              aria-label="Search CAMPUS-NEXUS"
              name="search"
              placeholder="Search anything... (marks, courses, queries)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#CDEBDD] rounded-full pl-9 pr-4 py-2 text-xs text-[#0B2E22] placeholder-[#7A968A] focus:outline-none focus:border-[#34D399] focus:ring-2 focus:ring-[#34D399]/30 transition-all shadow-sm"
            />
          </div>

          {/* Notification Bell */}
          <button
            aria-label="Notifications"
            className="relative p-2 rounded-full bg-[#F0FAF5] border border-[#CDEBDD] hover:border-[#34D399] text-[#047857] hover:text-[#065F46] transition-all shadow-sm"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
              3
            </span>
          </button>

          {/* CTA Buttons */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={getDashboardPathForRole(user.role)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FACC15] hover:bg-[#EAB308] text-[#0B2E22] flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Dashboard ({user.role?.toUpperCase() || "NITX"})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-3 py-2 text-xs text-[#4B6B5E] hover:text-red-700 rounded-lg border border-[#CDEBDD] hover:border-red-300 transition-colors flex items-center gap-1 bg-[#F0FAF5]"
                  title="Sign out of CAMPUS-NEXUS"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          ) : onLogin ? (
            <button
              onClick={onLogin}
              className="btn-gold-primary px-3 sm:px-5 py-2 text-xs flex items-center gap-1.5"
            >
              <span className="hidden sm:inline">Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FACC15] hover:bg-[#EAB308] text-[#0B2E22] flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="xl:hidden px-4 pt-2 pb-6 bg-burgundy-950/95 border-b border-gold-500/30 backdrop-blur-2xl">
          <div className="flex flex-col gap-2.5">
            <div className="relative mb-2">
              <Search className="w-4 h-4 text-[#4B6B5E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                aria-label="Search CAMPUS-NEXUS"
                name="mobile-search"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F0FAF5] border border-[#CDEBDD] rounded-lg pl-9 pr-3 py-2 text-xs text-[#0B2E22] placeholder-[#7A968A]"
              />
            </div>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-[#0B2E22] hover:bg-[#F0FAF5]"
            >
              Home
            </Link>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-[#4B6B5E] hover:bg-[#F0FAF5] hover:text-[#0B2E22]"
            >
              Features
            </a>
            <a
              href="#portals"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-[#4B6B5E] hover:bg-[#F0FAF5] hover:text-[#0B2E22]"
            >
              Portals
            </a>
            <a
              href="#insights"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-[#4B6B5E] hover:bg-[#F0FAF5] hover:text-[#0B2E22]"
            >
              AI Insights
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-[#4B6B5E] hover:bg-[#F0FAF5] hover:text-[#0B2E22]"
            >
              About
            </a>
            <a
              href="#resources"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-[#4B6B5E] hover:bg-[#F0FAF5] hover:text-[#0B2E22]"
            >
              Resources
            </a>
            <div className="pt-2 border-t border-[#CDEBDD]">
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href={getDashboardPathForRole(user.role)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center text-xs font-bold rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0B2E22] shadow-sm"
                  >
                    Go to Dashboard ({user.role?.toUpperCase() || "NITX"})
                  </Link>
                  {onLogout && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full py-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg text-center"
                    >
                      Logout
                    </button>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs font-bold rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0B2E22] shadow-sm block"
                >
                  Login to Campus-Nexus
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
