"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, BookOpenCheck, Sparkles, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { AuthUser } from "@/context/AuthContext";

const TOUR_STEPS = [
  {
    title: "Welcome To Your Workspace",
    description: "Your account is ready. This workspace will show your campus information as it becomes available.",
  },
  {
    title: "Your Numbers Start Fresh",
    description: "New accounts begin with zero stats. Sample campus data will not be presented as your own.",
  },
  {
    title: "Explore When You’re Ready",
    description: "Your dashboard will grow as your campus links your courses, records, and activity.",
  },
];

interface FreshRoleDashboardProps {
  user: AuthUser;
  roleLabel: string;
  metrics: string[];
  onLogout: () => void;
}

export function FreshRoleDashboard({
  user,
  roleLabel,
  metrics,
  onLogout,
}: FreshRoleDashboardProps) {
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  useEffect(() => {
    try {
      setTourOpen(localStorage.getItem(`nexus_role_tour_complete:${user.id}`) !== "true");
    } catch (error) {
      console.error("Could not read role tour status:", error);
    }
  }, [user.id]);

  const closeTour = useCallback(() => {
    try {
      localStorage.setItem(`nexus_role_tour_complete:${user.id}`, "true");
    } catch (error) {
      console.error("Could not save role tour status:", error);
    }
    setTourOpen(false);
  }, [user.id]);

  useEffect(() => {
    if (!tourOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeTour();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeTour, tourOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#120206] via-[#1B040A] to-[#2E0813] text-white">
      <header className="sticky top-0 z-40 border-b border-gold-500/30 bg-burgundy-950/90 px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <Logo size="sm" />
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden truncate text-xs text-gold-200/80 sm:inline">{roleLabel} Workspace</span>
            <button
              type="button"
              onClick={onLogout}
              className="shrink-0 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="rounded-3xl border border-gold-500/30 bg-burgundy-900/80 p-6 shadow-2xl sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-gold-300">{roleLabel} workspace</p>
          <h1 className="mt-2 break-words text-2xl font-extrabold sm:text-3xl [text-wrap:balance]">
            Welcome, {user.full_name.split(" ")[0]}
          </h1>
          <p className="mt-2 max-w-2xl break-words text-sm leading-relaxed text-gold-100/70">
            Your account is ready. These stats start at zero and will show your real campus information when it becomes available.
          </p>
          <button
            type="button"
            onClick={() => {
              setTourStep(0);
              setTourOpen(true);
            }}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-gold-400 px-4 py-2.5 text-sm font-bold text-burgundy-950 hover:bg-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Start Dashboard Tour
          </button>
        </section>

        <section aria-label="Your current stats" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric} className="min-w-0 rounded-2xl border border-gold-500/30 bg-burgundy-900/75 p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="min-w-0 break-words text-xs font-semibold uppercase tracking-wide text-gold-200/80">{metric}</h2>
                <BookOpenCheck className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
              </div>
              <p className="mt-4 text-3xl font-extrabold tabular-nums">0</p>
              <p className="mt-1 text-xs text-gold-300">New</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-gold-500/25 bg-burgundy-900/70 p-5">
          <h2 className="text-base font-bold">No campus records yet</h2>
          <p className="mt-2 max-w-2xl break-words text-sm leading-relaxed text-gold-100/70">
            Your dashboard will fill in when your institution makes your records available. You can sign in again with this account to return here.
          </p>
        </section>
      </main>

      {tourOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="role-tour-title"
            aria-describedby="role-tour-description"
            className="w-full max-w-lg rounded-2xl border border-gold-500/35 bg-burgundy-950 p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gold-300">Dashboard Tour · {tourStep + 1} of {TOUR_STEPS.length}</p>
                <h2 id="role-tour-title" className="mt-2 text-xl font-bold [text-wrap:balance]">{TOUR_STEPS[tourStep].title}</h2>
              </div>
              <button
                type="button"
                onClick={closeTour}
                aria-label="Close tour"
                className="shrink-0 rounded-lg p-2 text-gold-200/80 hover:bg-burgundy-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p id="role-tour-description" aria-live="polite" className="mt-4 text-sm leading-relaxed text-gold-100/75">
              {TOUR_STEPS[tourStep].description}
            </p>
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={closeTour}
                className="rounded-lg px-3 py-2 text-xs font-semibold text-gold-200/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
              >
                Skip Tour
              </button>
              <div className="flex gap-2">
                {tourStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setTourStep((step) => Math.max(0, step - 1))}
                    className="rounded-lg border border-gold-500/30 px-3 py-2 text-xs font-semibold text-gold-200 hover:bg-burgundy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (tourStep === TOUR_STEPS.length - 1) closeTour();
                    else setTourStep((step) => Math.min(TOUR_STEPS.length - 1, step + 1));
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-gold-400 px-4 py-2 text-xs font-bold text-burgundy-950 hover:bg-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
                >
                  {tourStep === TOUR_STEPS.length - 1 ? "Finish Tour" : "Next"}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
