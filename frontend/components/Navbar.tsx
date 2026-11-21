"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, Bell, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";

const menuLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Portals", href: "/#portals" },
  { label: "AI Insights", href: "/#insights" },
  { label: "About", href: "/#about" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="relative z-50 w-full border-y border-amber-200 bg-white">
      <div className="mx-auto flex h-[84px] w-[92%] -translate-y-2 items-center justify-between gap-3 sm:h-[124px] sm:w-[90%] sm:gap-5">
        <div className="flex min-w-0 shrink-0 items-center gap-3 sm:gap-4">
          <button
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-200 bg-[#F0FAF5] text-amber-500 transition-colors hover:bg-amber-50 sm:h-16 sm:w-16"
          >
            {open ? <X className="h-6 w-6 sm:h-7 sm:w-7" /> : <Menu className="h-6 w-6 sm:h-7 sm:w-7" />}
          </button>
          <div>
            <Logo size="lg" />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <label className="relative hidden w-[25vw] min-w-[250px] max-w-[380px] lg:block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#4B6B5E]" />
            <input
              type="search"
              aria-label="Search CAMPUS-NEXUS"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-full border border-[#CDEBDD] bg-white py-3 pl-12 pr-4 text-sm text-[#0B2E22] shadow-sm placeholder-[#7A968A] focus:border-[#34D399] focus:outline-none focus:ring-2 focus:ring-[#34D399]/30"
            />
          </label>
          <button aria-label="Notifications" className="relative hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#CDEBDD] bg-[#F0FAF5] text-[#047857] shadow-sm sm:flex">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">3</span>
          </button>
          <Link href="/login" className="flex shrink-0 items-center gap-2 rounded-xl bg-[#FACC15] px-4 py-3 text-sm font-bold text-[#0B2E22] shadow-sm transition-colors hover:bg-[#EAB308] sm:px-6">
            <span className="hidden sm:inline">Login</span><ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {open && (
        <nav className="absolute left-[9%] top-full z-50 mt-2 flex min-w-52 flex-col rounded-xl border border-emerald-100 bg-white p-2 shadow-xl">
          {menuLinks.map(({ label, href }) => (
            <Link key={label} href={href} onClick={() => setOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-[#31594C] hover:bg-emerald-50">
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
