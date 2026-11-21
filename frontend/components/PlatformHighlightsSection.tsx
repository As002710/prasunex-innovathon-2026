"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  MousePointer2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const prompts = ["Weak topics", "Study plan", "Grade check"];

export function PlatformHighlightsSection({
  onDemoRole,
}: {
  onDemoRole: (roleKey: string) => void;
}) {
  const [reply, setReply] = useState("Hi Student! How can I help you today?");

  return (
    <section id="features" className="scroll-mt-[72px] border-y border-emerald-100 bg-[#FCFDFB] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 divide-y divide-emerald-100 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { icon: Brain, title: "15 AI Modules", detail: "One intelligent campus" },
            { icon: ShieldCheck, title: "Zero Silos", detail: "Connected academic workflows" },
            { icon: MousePointer2, title: "1-Click Role Access", detail: "The right tools for every role" },
          ].map(({ icon: Icon, title, detail }) => (
            <div key={title} className="flex items-center gap-3 px-5 py-4 sm:justify-center sm:py-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#0F5C4C]"><Icon className="h-5 w-5" /></span>
              <span><strong className="block text-sm font-bold text-[#123A32]">{title}</strong><span className="text-xs text-slate-500">{detail}</span></span>
            </div>
          ))}
        </div>

        <div className="mx-auto mb-9 mt-14 max-w-2xl text-center sm:mt-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-amber-900"><Sparkles className="h-3.5 w-3.5 text-amber-600" />Features &amp; Interactive Preview</span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-[#123A32] sm:text-4xl">A smarter campus, in action</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">Explore the AI tools that help students improve, faculty act earlier, and institutions make confident decisions.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <article className="flex min-h-[350px] flex-col rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_12px_36px_rgba(15,92,76,0.07)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50"><Image src="/images/robot.svg" alt="NEXUS Bot" width={32} height={32} className="object-contain" /></div>
              <div><p className="text-xs font-bold uppercase tracking-wider text-[#0F5C4C]">24/7 AI tutor</p><h3 className="text-lg font-extrabold text-[#123A32]">Meet NEXUS Bot</h3></div>
              <span className="ml-auto rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">Online</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">Your always available study companion, ready to explain concepts and shape a practical next step.</p>
            <div className="mt-4 rounded-xl border border-emerald-100 bg-[#F4FAF7] p-3.5">
              <div className="flex items-start gap-2.5"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#0F5C4C]"><Sparkles className="h-4 w-4" /></span><p aria-live="polite" className="pt-1 text-[13px] leading-relaxed text-[#25483D]">{reply}</p></div>
            </div>
            <div className="mt-auto flex flex-wrap gap-2 pt-4">{prompts.map((prompt) => <button key={prompt} onClick={() => setReply(prompt === "Weak topics" ? "I found 3 topics to revisit. Shall we start with Database Normalization?" : prompt === "Study plan" ? "Let’s build a focused 5-day revision plan around your next exam." : "Your current predicted grade is 78.5%, with room to improve in Networks.")} className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-[#0F5C4C] transition hover:bg-emerald-50">{prompt}</button>)}</div>
          </article>

          <article className="min-h-[350px] rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_12px_36px_rgba(15,92,76,0.07)]">
            <div className="flex items-center gap-2 text-[#0F5C4C]"><BookOpen className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-wider">Personal learning</span></div>
            <h3 className="mt-2 text-lg font-extrabold text-[#123A32]">My Mastery Map</h3>
            <div className="mt-5 flex items-center gap-5">
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full" style={{ background: "conic-gradient(#10B981 0% 72%, #E7F2EC 72% 100%)" }}>
                <div className="flex h-[82px] w-[82px] flex-col items-center justify-center rounded-full bg-white"><span className="text-2xl font-black text-[#123A32]">72%</span><span className="text-[10px] font-bold uppercase tracking-wide text-[#0F5C4C]">Mastery</span></div>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">See what you know and where a little focused practice can make a difference.</p>
            </div>
            <div className="mt-6 space-y-4">{[{ name: "DBMS", value: 92 }, { name: "Operating Systems", value: 78 }, { name: "Networks", value: 64 }].map((subject) => <div key={subject.name}><div className="mb-1.5 flex justify-between text-xs font-semibold"><span className="text-slate-600">{subject.name}</span><span className="text-[#0F5C4C]">{subject.value}%</span></div><div className="h-2 overflow-hidden rounded-full bg-emerald-50"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${subject.value}%` }} /></div></div>)}</div>
          </article>

          <article className="flex min-h-[350px] flex-col rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_12px_36px_rgba(15,92,76,0.07)]">
            <div className="flex items-center gap-2 text-[#0F5C4C]"><TrendingUp className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-wider">Institutional intelligence</span></div>
            <h3 className="mt-2 text-lg font-extrabold text-[#123A32]">Smart Campus Analytics</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">Predictive academic insights help teams spot learning gaps early, understand cohort trends, and take timely action.</p>
            <div className="mt-5 space-y-3 rounded-xl bg-[#F4FAF7] p-4">
              {["Early academic risk signals", "Cohort performance trends", "Connected role-based workflows"].map((line) => <div key={line} className="flex items-center gap-2.5 text-[13px] font-medium text-[#31594C]"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />{line}</div>)}
            </div>
            <div className="mt-auto grid grid-cols-3 gap-2 pt-5">{[{ label: "Student", role: "student" }, { label: "Faculty", role: "professor_hod" }, { label: "Admin", role: "chancellor_dean" }].map(({ label, role }) => <button key={role} onClick={() => onDemoRole(role)} className="flex items-center justify-center gap-1 rounded-lg border border-emerald-200 px-2 py-2.5 text-xs font-bold text-[#0F5C4C] transition hover:bg-emerald-50">{label}<ArrowRight className="h-3 w-3" /></button>)}</div>
          </article>
        </div>
      </div>
    </section>
  );
}
