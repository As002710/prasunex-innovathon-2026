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
        <nav className="hidden xl:flex items-center gap-1.5 bg-burgundy-900/80 p-1.5 rounded-full border border-gold-500/30 backdrop-blur-md">
          {/* Home Active Pill */}
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              pathname === "/"
                ? "bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-burgundy-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                : "text-gold-200/80 hover:text-white hover:bg-burgundy-800/60"
            }`}
          >
            Home
          </Link>

          {/* Features Dropdown */}
          <a
            href="#features"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-gold-200/80 hover:text-white hover:bg-burgundy-800/60 transition-all"
          >
            Features <ChevronDown className="w-3 h-3 text-gold-400" />
          </a>

          {/* Portals Dropdown */}
          <a
            href="#portals"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-gold-200/80 hover:text-white hover:bg-burgundy-800/60 transition-all"
          >
            Portals <ChevronDown className="w-3 h-3 text-gold-400" />
          </a>

          {/* AI Insights */}
          <a
            href="#insights"
            className="px-3 py-1.5 rounded-full text-xs font-medium text-gold-200/80 hover:text-white hover:bg-burgundy-800/60 transition-all"
          >
            AI Insights
          </a>

          {/* About */}
          <a
            href="#about"
            className="px-3 py-1.5 rounded-full text-xs font-medium text-gold-200/80 hover:text-white hover:bg-burgundy-800/60 transition-all"
          >
            About
          </a>

          {/* Resources Dropdown */}
          <a
            href="#resources"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-gold-200/80 hover:text-white hover:bg-burgundy-800/60 transition-all"
          >
            Resources <ChevronDown className="w-3 h-3 text-gold-400" />
          </a>
        </nav>

        {/* Right: Search Box + Bell + Login CTA */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative hidden md:block w-64 lg:w-72">
            <Search className="w-3.5 h-3.5 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              aria-label="Search CAMPUS-NEXUS"
              name="search"
              placeholder="Search anything... (marks, courses, queries)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-burgundy-900/80 border border-gold-500/30 rounded-full pl-9 pr-4 py-2 text-xs text-gold-100 placeholder:text-gold-200/40 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all backdrop-blur-md"
            />
          </div>

          {/* Notification Bell */}
          <button
            aria-label="Notifications"
            className="relative p-2 rounded-full bg-burgundy-900/80 border border-gold-500/35 hover:border-gold-400 text-gold-300 hover:text-white transition-all shadow-sm"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-burgundy-950 shadow-[0_0_8px_rgba(239,68,68,0.8)]">
              3
            </span>
          </button>

          {/* Gold "Login →" or "Dashboard" CTA */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={getDashboardPathForRole(user.role)}
                className="btn-gold-primary px-4 py-2 text-xs flex items-center gap-1.5"
              >
                <span>Dashboard ({user.role?.toUpperCase() || "NITX"})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-3 py-2 text-xs text-gold-200/70 hover:text-white rounded-lg border border-gold-500/30 hover:border-gold-400 transition-colors flex items-center gap-1 bg-burgundy-900/50"
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
              className="btn-gold-primary px-5 py-2 text-xs flex items-center gap-1.5"
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
              <Search className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                aria-label="Search CAMPUS-NEXUS"
                name="mobile-search"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-burgundy-900 border border-gold-500/30 rounded-lg pl-9 pr-3 py-2 text-xs text-white"
              />
            </div>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-white hover:bg-burgundy-800"
            >
              Home
            </Link>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-gold-200/80 hover:bg-burgundy-800"
            >
              Features
            </a>
            <a
              href="#portals"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-gold-200/80 hover:bg-burgundy-800"
            >
              Portals
            </a>
            <a
              href="#insights"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-gold-200/80 hover:bg-burgundy-800"
            >
              AI Insights
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-gold-200/80 hover:bg-burgundy-800"
            >
              About
            </a>
            <a
              href="#resources"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-gold-200/80 hover:bg-burgundy-800"
            >
              Resources
            </a>
            <div className="pt-2 border-t border-gold-500/20">
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href={getDashboardPathForRole(user.role)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-gold-primary w-full py-2.5 text-center text-xs"
                  >
                    Go to Dashboard ({user.role?.toUpperCase() || "NITX"})
                  </Link>
                  {onLogout && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full py-2 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg text-center"
                    >
                      Logout
                    </button>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-gold-primary w-full py-2.5 text-center text-xs"
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
