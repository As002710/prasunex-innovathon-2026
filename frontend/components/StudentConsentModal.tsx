"use client";

import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

interface StudentConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export function StudentConsentModal({ isOpen, onAccept }: StudentConsentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 bg-plum-900 border border-pink-primary/40 rounded-2xl shadow-2xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pink-primary/20 text-pink-primary border border-pink-primary/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Student Data Privacy & Consent</h3>
            <p className="text-xs text-amber-secondary">CAMPUS-NEXUS Academic Insight Layer</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-plum-950/80 border border-plum-700/60 space-y-3 text-xs leading-relaxed text-pink-light/90">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-mint-good shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">Strict Academic Purpose:</strong> Your question-level marks and diagnostic data are used{" "}
              <span className="text-pink-primary font-semibold underline decoration-pink-primary/40">
                only for academic and campus support
              </span>.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-mint-good shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">Non-Punitive Advisory:</strong> Diagnostic flags and Bayesian mastery indicators are recommendations only and{" "}
              <strong className="text-amber-secondary">never feed into disciplinary actions or permanent grade penalties</strong>.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-sky-info shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">Zero Third-Party Sharing:</strong> All models run in-browser or on institutional infrastructure. No external paid commercial AI APIs receive your identifying information.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onAccept}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-pink-primary to-pink-glow text-plum-950 hover:brightness-110 shadow-[0_0_15px_rgba(242,139,168,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <span>I Understand & Accept Consent</span>
          </button>
        </div>
      </div>
    </div>
  );
}
