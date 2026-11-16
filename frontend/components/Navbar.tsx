"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { Search, Bell, ChevronDown, ArrowRight, Menu, X } from "lucide-react";

interface NavbarProps {
  onLogin?: () => void;
  user?: any;
  onBackToConsole?: () => void;
  onLogout?: () => void;
}

export function Navbar({ onLogin, user, onBackToConsole, onLogout }: NavbarProps = {}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-darkEmerald-950/80 border-b border-mint-400/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Logo size="md" />
        </div>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-1.5 bg-darkEmerald-900/60 p-1.5 rounded-full border border-mint-400/20 backdrop-blur-md">
          {/* Home Active Pill */}
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              pathname === "/"
                ? "bg-mint-400 text-darkEmerald-950 shadow-[0_0_15px_rgba(74,222,154,0.4)]"
                : "text-mint-accent/80 hover:text-white hover:bg-darkEmerald-800/60"
            }`}
          >
            Home
          </Link>

          {/* Features Dropdown */}
          <a
            href="#features"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-mint-accent/80 hover:text-white hover:bg-darkEmerald-800/60 transition-all"
          >
            Features <ChevronDown className="w-3 h-3 text-mint-400/70" />
          </a>

          {/* Portals Dropdown */}
          <a
            href="#portals"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-mint-accent/80 hover:text-white hover:bg-darkEmerald-800/60 transition-all"
          >
            Portals <ChevronDown className="w-3 h-3 text-mint-400/70" />
          </a>

          {/* AI Insights */}
          <a
            href="#insights"
            className="px-3 py-1.5 rounded-full text-xs font-medium text-mint-accent/80 hover:text-white hover:bg-darkEmerald-800/60 transition-all"
          >
            AI Insights
          </a>

          {/* About */}
          <a
            href="#about"
            className="px-3 py-1.5 rounded-full text-xs font-medium text-mint-accent/80 hover:text-white hover:bg-darkEmerald-800/60 transition-all"
          >
            About
          </a>

          {/* Resources Dropdown */}
          <a
            href="#resources"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-mint-accent/80 hover:text-white hover:bg-darkEmerald-800/60 transition-all"
          >
            Resources <ChevronDown className="w-3 h-3 text-mint-400/70" />
          </a>
        </nav>

        {/* Right: Search Box + Bell + Login CTA */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative hidden md:block w-64 lg:w-72">
            <Search className="w-3.5 h-3.5 text-mint-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search anything... (marks, courses, queries)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-darkEmerald-900/70 border border-mint-400/25 rounded-full pl-9 pr-4 py-2 text-xs text-mint-100 placeholder:text-mint-accent/40 focus:outline-none focus:border-mint-accent focus:ring-1 focus:ring-mint-accent transition-all backdrop-blur-md"
            />
          </div>

          {/* Notification Bell with red badge '3' */}
          <button
            aria-label="Notifications"
            className="relative p-2 rounded-full bg-darkEmerald-900/60 border border-mint-400/25 hover:border-mint-accent text-mint-accent hover:text-white transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-darkEmerald-950 shadow-[0_0_8px_rgba(239,68,68,0.8)]">
              3
            </span>
          </button>

          {/* Mint "Login →" or "Console" CTA */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onBackToConsole}
                className="btn-mint-primary px-4 py-2 text-xs flex items-center gap-1.5"
              >
                <span>Console ({user.college_code})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-3 py-2 text-xs text-mint-accent/70 hover:text-white rounded-lg border border-mint-400/20 hover:border-mint-400/50 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          ) : onLogin ? (
            <button
              onClick={onLogin}
              className="btn-mint-primary px-5 py-2 text-xs flex items-center gap-1.5"
            >
              <span>Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href="/student/dashboard"
              className="btn-mint-primary px-5 py-2 text-xs flex items-center gap-1.5"
            >
              <span>Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-darkEmerald-900/80 border border-mint-400/20 text-mint-400"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden px-4 pt-2 pb-6 bg-darkEmerald-950/95 border-b border-mint-400/20 backdrop-blur-2xl">
          <div className="flex flex-col gap-2.5">
            <div className="relative mb-2">
              <Search className="w-4 h-4 text-mint-400/70 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-darkEmerald-900 border border-mint-400/25 rounded-lg pl-9 pr-3 py-2 text-xs text-white"
              />
            </div>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-mint-400 text-darkEmerald-950"
            >
              Home
            </Link>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-lg text-sm text-mint-accent/80 hover:text-white"
            >
              Features
            </a>
            <a
              href="#portals"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-lg text-sm text-mint-accent/80 hover:text-white"
            >
              Portals
            </a>
            <a
              href="#insights"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-lg text-sm text-mint-accent/80 hover:text-white"
            >
              AI Insights
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-lg text-sm text-mint-accent/80 hover:text-white"
            >
              About
            </a>
            {user ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onBackToConsole?.(); }}
                className="mt-2 w-full btn-mint-primary py-2.5 text-center text-sm font-bold flex items-center justify-center gap-2"
              >
                <span>Console ({user.college_code})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : onLogin ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onLogin(); }}
                className="mt-2 w-full btn-mint-primary py-2.5 text-center text-sm font-bold flex items-center justify-center gap-2"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 w-full btn-mint-primary py-2.5 text-center text-sm font-bold flex items-center justify-center gap-2"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
