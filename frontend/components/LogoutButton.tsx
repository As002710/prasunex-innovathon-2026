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

    // Use authLogout to clear React state, but we override the redirect
    // authLogout internally pushes to /login — so we do our own redirect after a tick
    // Instead, just clear state manually and redirect to home
    setShowConfirm(false);

    // Redirect to home page (/)
    window.location.href = "/";
  };

  return (
    <div className="fixed top-5 right-5 z-[9999]" ref={popoverRef}>
      {/* Click 1: Trigger Button */}
      <button
        onClick={() => setShowConfirm(!showConfirm)}
        className="group relative flex items-center gap-2 px-4 py-2.5 rounded-2xl
                   bg-gradient-to-r from-red-600/90 to-red-700/90
                   hover:from-red-500 hover:to-red-600
                   border border-red-400/40 hover:border-red-400/70
                   text-white text-xs font-bold tracking-wide
                   shadow-lg shadow-red-900/40 hover:shadow-red-800/60
                   backdrop-blur-xl transition-all duration-300
                   hover:scale-105 active:scale-95"
        title="Sign out of CAMPUS-NEXUS"
        aria-label="Logout"
      >
        <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        <span className="hidden sm:inline">Logout</span>

        {/* Subtle pulse ring */}
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-400 animate-ping opacity-40" />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-400" />
      </button>

      {/* Click 2: Confirmation Popover */}
      {showConfirm && (
        <div
          className="absolute top-full right-0 mt-3 w-72 sm:w-80
                     bg-burgundy-950/95 backdrop-blur-2xl
                     border border-red-500/40 rounded-2xl
                     shadow-2xl shadow-black/60
                     animate-[fadeSlideIn_0.2s_ease-out]
                     overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <LogOut className="w-4 h-4 text-red-400" />
              Confirm Logout
            </h3>
            <button
              onClick={() => setShowConfirm(false)}
              className="p-1 rounded-lg text-gold-200/50 hover:text-white hover:bg-burgundy-800 transition-colors"
              aria-label="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-4 py-3 mx-3 mb-3 rounded-xl bg-burgundy-900/80 border border-gold-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-burgundy-950 font-extrabold flex items-center justify-center text-sm shadow-lg">
                {user.full_name?.slice(0, 2).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user.full_name || "Campus User"}
                </p>
                <p className="text-[11px] text-gold-400/80 truncate">
                  {user.email}
                </p>
                <p className="text-[10px] text-gold-200/50 uppercase tracking-wider mt-0.5">
                  {user.role || "User"} · {user.college_code || "NITX"}
                </p>
              </div>
            </div>
          </div>

          {/* Warning text */}
          <p className="px-4 pb-3 text-[11px] text-gold-200/60 leading-relaxed">
            Kya aap sure hain? Logout karne se aapka current session end ho jayega aur aap Home Page pe redirect ho jaayenge.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2 px-4 pb-4">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 px-4 py-2.5 text-xs font-semibold rounded-xl
                         bg-burgundy-900/80 border border-gold-500/30
                         text-gold-200 hover:text-white hover:border-gold-400
                         transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-2.5 text-xs font-bold rounded-xl
                         bg-gradient-to-r from-red-600 to-red-700
                         hover:from-red-500 hover:to-red-600
                         border border-red-500/50 hover:border-red-400
                         text-white shadow-lg shadow-red-900/30
                         transition-all duration-200
                         hover:scale-[1.02] active:scale-95
                         flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Yes, Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
