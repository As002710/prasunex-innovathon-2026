"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, LogOut, Columns } from "lucide-react";
import { Logo } from "@/components/Logo";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface DashboardTopNavbarProps {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  user?: {
    full_name?: string;
    name?: string;
    email?: string;
    role?: string;
  } | null;
  onLogout?: () => void;
  roleBadgeText?: string;
  roleColor?: string; // #047857 (student), #1D4ED8 (faculty), #BE185D (staff), #B91C1C (admin)
  tagline?: string;
}

export function DashboardTopNavbar({
  items,
  activeId,
  onSelect,
  user,
  onLogout,
  roleBadgeText,
  roleColor = "#047857",
  tagline = "Find why a student is failing. Then fix it.",
}: DashboardTopNavbarProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  const visibleItems = items.slice(0, 6);
  const moreItems = items.slice(6);
  const isMoreActive = moreItems.some((item) => item.id === activeId);

  // Close menus on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMoreOpen(false);
        setIsMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const userName = user?.full_name || user?.name || "Student User";
  const userInitials = userName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const roleName = roleBadgeText || user?.role || "Student";

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-white border-b border-[#CDEBDD] shadow-[0_1px_2px_rgba(11,46,34,0.06)] px-4 sm:px-6">
      <div className="max-w-[1440px] h-full mx-auto flex items-center justify-between gap-4">
        {/* LEFT AREA: Logo & Tagline */}
        <div className="flex items-center gap-3.5 shrink-0">
          <Logo size="sm" showTagline={false} />
          {tagline && (
            <span className="hidden xl:inline-block text-xs font-normal text-[#4B6B5E] pl-3 border-l border-[#CDEBDD] leading-tight">
              {tagline}
            </span>
          )}
        </div>

        {/* CENTER AREA: Navigation Items (hidden on mobile < 768px) */}
        <nav aria-label="Main" className="hidden md:flex items-center gap-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                aria-current={isActive ? "page" : undefined}
                title={item.label}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#34D399]/40 ${
                  isActive
                    ? "bg-[#34D399] text-[#0B2E22] font-semibold after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:bg-[#FACC15]"
                    : "text-[#4B6B5E] hover:bg-[#F0FAF5] hover:text-[#0B2E22]"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#0B2E22]" : "text-[#4B6B5E]"}`} />
                <span className="hidden xl:inline">{item.label}</span>
              </button>
            );
          })}

          {/* "More" Dropdown for Items 7-10 */}
          {moreItems.length > 0 && (
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                aria-expanded={isMoreOpen}
                aria-haspopup="true"
                aria-label="More navigation items"
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#34D399]/40 ${
                  isMoreActive
                    ? "bg-[#34D399] text-[#0B2E22] font-semibold after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:bg-[#FACC15]"
                    : "text-[#4B6B5E] hover:bg-[#F0FAF5] hover:text-[#0B2E22]"
                }`}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isMoreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isMoreOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 bg-white border border-[#CDEBDD] rounded-xl shadow-[0_4px_16px_rgba(11,46,34,0.08)] p-1.5 z-50 animate-fadeIn"
                >
                  {moreItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeId === item.id;
                    return (
                      <button
                        key={item.id}
                        role="menuitem"
                        onClick={() => {
                          onSelect(item.id);
                          setIsMoreOpen(false);
                        }}
                        aria-current={isActive ? "page" : undefined}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                          isActive
                            ? "bg-[#34D399] text-[#0B2E22] font-semibold"
                            : "text-[#4B6B5E] hover:bg-[#F0FAF5] hover:text-[#0B2E22]"
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#0B2E22]" : "text-[#4B6B5E]"}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* RIGHT AREA: User Info & Logout + Mobile Hamburger Button */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Split Screen Frontend + Backend Button */}
          <Link
            href="/split"
            title="View Frontend & Backend API Docs Side-by-Side"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F0FAF5] hover:bg-[#FEF9C3] border border-[#CDEBDD] hover:border-[#FACC15] text-[11px] font-semibold text-[#0B2E22] transition-all"
          >
            <Columns className="w-3.5 h-3.5 text-[#047857]" />
            <span>Split View</span>
          </Link>

          {/* User profile card */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border"
              style={{
                backgroundColor: `${roleColor}1A`, // 10% opacity tint
                color: roleColor,
                borderColor: `${roleColor}4D`, // 30% border
              }}
            >
              {userInitials}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[#0B2E22] leading-tight truncate max-w-[130px]">
                {userName}
              </span>
              <span
                className="text-[10px] font-semibold uppercase tracking-wider inline-block"
                style={{ color: roleColor }}
              >
                {roleName}
              </span>
            </div>
          </div>

          {/* Logout action */}
          {onLogout && (
            <button
              onClick={onLogout}
              aria-label="Log Out"
              title="Log Out"
              className="p-2 rounded-lg text-[#4B6B5E] hover:text-[#B91C1C] hover:bg-[#F0FAF5] transition-all focus:outline-none focus:ring-2 focus:ring-[#34D399]/40"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {/* Hamburger button for Mobile (<768px) */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-expanded={isMobileOpen}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 rounded-lg text-[#0B2E22] hover:bg-[#F0FAF5] border border-[#CDEBDD] transition-all"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE SLIDE-DOWN MENU (<768px) */}
      {isMobileOpen && (
        <div
          ref={mobileRef}
          className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-[#CDEBDD] shadow-[0_8px_20px_rgba(11,46,34,0.08)] p-4 max-h-[calc(100vh-64px)] overflow-y-auto z-50 animate-fadeIn"
        >
          <div className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item.id);
                    setIsMobileOpen(false);
                  }}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                    isActive
                      ? "bg-[#34D399] text-[#0B2E22] font-semibold"
                      : "text-[#4B6B5E] hover:bg-[#F0FAF5] hover:text-[#0B2E22]"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#0B2E22]" : "text-[#4B6B5E]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-[#CDEBDD] flex items-center justify-between text-xs text-[#4B6B5E]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0B2E22]">{userName}</span>
              <span className="text-[10px] uppercase font-bold" style={{ color: roleColor }}>
                ({roleName})
              </span>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-[#B91C1C] font-semibold flex items-center gap-1 hover:underline"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
