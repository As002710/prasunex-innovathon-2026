"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * LogoutButton — Fixed top-right corner logout button (all pages)
 * 
 * Flow (2-click logout):
 *   Click 1 → Confirmation popup appears
 *   Click 2 → "Yes, Logout" → clears session → redirects to home page (/)
 */
export function LogoutButton() {
  const { user, isAuthenticated, logout: authLogout } = useAuth();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowConfirm(false);
      }
    }
    if (showConfirm) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showConfirm]);

  // Close on Escape key
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setShowConfirm(false);
    }
    if (showConfirm) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [showConfirm]);

  // Don't show if not logged in
  if (!isAuthenticated || !user) return null;

  const handleLogout = () => {
    // Clear all auth state
    localStorage.removeItem("nexus_token");
    localStorage.removeItem("nexus_user");

    // Delete cookies
    document.cookie = "nexus_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
    document.cookie = "nexus_role=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";

    // Call backend logout (fire and forget)
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});

    setShowConfirm(false);
    window.location.href = "/";
  };

  return (
    <div className="fixed top-5 right-5 z-[9999]" ref={popoverRef}>
      {/* Click 1: Trigger Button */}
      <button
        onClick={() => setShowConfirm(!showConfirm)}
        className="group relative flex items-center gap-2 px-3.5 py-2 rounded-xl
                   bg-white hover:bg-[#F0FAF5]
                   border border-[#CDEBDD] hover:border-[#34D399]
                   text-[#0B2E22] text-xs font-semibold
                   shadow-[0_1px_2px_rgba(11,46,34,0.06)] transition-all duration-200"
        title="Sign out of CAMPUS-NEXUS"
        aria-label="Logout"
      >
        <LogOut className="w-4 h-4 text-red-600 transition-transform group-hover:-translate-x-0.5" />
        <span className="hidden sm:inline">Logout</span>
      </button>

      {/* Click 2: Confirmation Popover */}
      {showConfirm && (
        <div
          className="absolute top-full right-0 mt-2 w-72 sm:w-80
                     bg-white
                     border border-[#CDEBDD] rounded-xl
                     shadow-[0_8px_24px_rgba(11,46,34,0.12)]
                     animate-fadeIn
                     overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-[#CDEBDD]">
            <h3 className="text-sm font-bold text-[#0B2E22] flex items-center gap-2">
              <LogOut className="w-4 h-4 text-red-600" />
              Confirm Logout
            </h3>
            <button
              onClick={() => setShowConfirm(false)}
              className="p-1 rounded-lg text-[#4B6B5E] hover:text-[#0B2E22] hover:bg-[#F0FAF5] transition-colors"
              aria-label="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-[#F0FAF5] border border-[#CDEBDD]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#34D399] text-[#0B2E22] font-bold flex items-center justify-center text-xs">
                {user.full_name?.slice(0, 2).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#0B2E22] truncate">
                  {user.full_name || "Campus User"}
                </p>
                <p className="text-[11px] text-[#4B6B5E] truncate">
                  {user.email}
                </p>
                <p className="text-[10px] text-[#047857] font-semibold uppercase tracking-wider mt-0.5">
                  {user.role || "User"} · {user.college_code || "NITX"}
                </p>
              </div>
            </div>
          </div>

          {/* Warning text */}
          <p className="px-4 pb-3 text-[11px] text-[#4B6B5E] leading-relaxed">
            Logging out will end your current session and return you to the home page.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2 px-4 pb-4">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 px-4 py-2 text-xs font-semibold rounded-xl
                         bg-white border border-[#CDEBDD]
                         text-[#4B6B5E] hover:text-[#0B2E22] hover:bg-[#F0FAF5]
                         transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-2 text-xs font-bold rounded-xl
                         bg-red-600 hover:bg-red-700
                         text-white shadow-sm transition-all"
            >
              Yes, Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
