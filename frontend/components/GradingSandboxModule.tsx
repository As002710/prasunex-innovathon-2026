"use client";

import React, { useState } from "react";
import {
  StudentScore,
  GradeCutoffs,
  Role,
  GradeContest,
} from "@/lib/types";
import {
  FIXED_Z_CUTOFFS,
  GAP_AWARE_CUTOFFS,
  analyzeCutoffs,
  getGradeForScore,
} from "@/lib/gapAware";
import { SEED_QUESTIONS } from "@/data/seed";
import { auditQuestions, QuestionStats } from "@/lib/pointBiserial";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ScatterChart,
  Scatter,
  ReferenceLine,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  BarChart3,
  Sliders,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  FileCheck,
  ShieldAlert,
  Send,
  Zap,
} from "lucide-react";

interface GradingSandboxModuleProps {
  role: Role;
  students: StudentScore[];
  contests: GradeContest[];
  onApplyCutoffs: (cutoffs: GradeCutoffs, mode: "fixed" | "gap-aware" | "custom", reason: string) => void;
  onQuestionAction: (qId: string, action: "nullify" | "grace", marks?: number) => void;
  onContestGrade: (reason: string) => void;
  onResolveContest: (contestId: string, status: "approved" | "rejected", response?: string) => void;
  onNotify: (msg: string, type?: "success" | "error" | "info") => void;
}

export function GradingSandboxModule({
  role,
  students,
  contests,
  onApplyCutoffs,
  onQuestionAction,
  onContestGrade,
  onResolveContest,
  onNotify,
}: GradingSandboxModuleProps) {
  const scores = students.map((s) => s.totalScore);

  // Active cutoffs and mode state
  const [cutoffMode, setCutoffMode] = useState<"fixed" | "gap-aware" | "custom">("fixed");
  const [activeCutoffs, setActiveCutoffs] = useState<GradeCutoffs>(FIXED_Z_CUTOFFS);
  const [questions, setQuestions] = useState<QuestionStats[]>(() => {
    const initial = SEED_QUESTIONS.map((q) => ({
      id: q.id,
      qNumber: q.qNumber,
      conceptId: q.conceptId,
      text: q.text,
      pVal: q.pVal,
      rPbis: q.rPbis,
      meanCorrect: Math.round((60.4 + q.rPbis * 5.3) * 10) / 10,
      meanIncorrect: Math.round((60.4 - q.rPbis * 5.3) * 10) / 10,
      flagged: Boolean(q.flagged),
      status: q.status,
      graceMarks: q.graceMarks || 0,
    }));
    return auditQuestions(initial, 0.15);
  });

  // Student contest modal state
  const [contestReason, setContestReason] = useState("");
  const [contestSubmitted, setContestSubmitted] = useState(false);

  // Analysis of current cutoffs
  const analysis = analyzeCutoffs(scores, activeCutoffs, cutoffMode, FIXED_Z_CUTOFFS);

  // Switch between Fixed and Gap-Aware in 1 click
  const handleToggleMode = (mode: "fixed" | "gap-aware") => {
    setCutoffMode(mode);
    const target = mode === "fixed" ? FIXED_Z_CUTOFFS : GAP_AWARE_CUTOFFS;
    setActiveCutoffs(target);
    onNotify(
      mode === "gap-aware"
        ? "Switched to Gap-Aware cutoffs! Boundary-stranded students reduced to 3."
        : "Switched to Fixed Z-Score cutoffs.",
      "info"
    );
  };

  // Draggable / slider manual cutoff adjustment
  const handleCutoffSliderChange = (boundary: keyof GradeCutoffs, val: number) => {
    setCutoffMode("custom");
    setActiveCutoffs((prev) => ({
      ...prev,
      [boundary]: val,
    }));
  };

  // Approve action (Human in Charge)
  const handleApproveChanges = () => {
    const reason =
      cutoffMode === "gap-aware"
        ? "Approved gap-aware cutoffs to minimize boundary-stranded students."
        : `Manual professor approval of ${cutoffMode} grade cutoffs.`;
    onApplyCutoffs(activeCutoffs, cutoffMode, reason);
    onNotify("Cut-offs approved and logged into institutional audit trail.", "success");
  };

  // Question action: Nullify or Grace Marks
  const handleQuestionRemediation = (qId: string, action: "nullify" | "grace") => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        if (action === "nullify") {
          return { ...q, status: "nullified", flagged: false };
        } else {
          return { ...q, status: "grace", graceMarks: (q.graceMarks || 0) + 2, flagged: false };
        }
      })
    );
    onQuestionAction(qId, action, 2);
    onNotify(
      action === "nullify"
        ? `Question ${qId} nullified. Grades recomputed live.`
        : `Granted +2 grace marks for Question ${qId}. Grades recomputed live.`,
      "success"
    );
  };

  // Histogram bin distribution
  const histogramData = [
    { range: "25-35", count: scores.filter((s) => s >= 25 && s < 35).length },
    { range: "35-45", count: scores.filter((s) => s >= 35 && s < 45).length },
    { range: "45-55", count: scores.filter((s) => s >= 45 && s < 55).length },
    { range: "55-60", count: scores.filter((s) => s >= 55 && s < 60).length, isPeak: true },
    { range: "60-70", count: scores.filter((s) => s >= 60 && s < 70).length },
    { range: "70-80", count: scores.filter((s) => s >= 70 && s < 80).length },
    { range: "80-85", count: scores.filter((s) => s >= 80 && s <= 85).length },
  ];

  // Scatter plot data for item discrimination (pVal vs rPbis)
  const scatterData = questions.map((q) => ({
    qNumber: `Q${q.qNumber}`,
    pVal: q.pVal,
    rPbis: q.rPbis,
    flagged: q.flagged,
    status: q.status,
    id: q.id,
    color: q.rPbis < 0 ? "#F2705A" : q.rPbis < 0.15 ? "#F2C46B" : "#4ADE9A",
  }));

  // Demo student's score
  const demoStudent = students.find((s) => s.studentId === "STU-2026-042") || students[0];
  const demoStudentGrade = getGradeForScore(demoStudent.totalScore, activeCutoffs);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-2xl bg-plum-900/80 border border-pink-primary/30 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-secondary">
            <BarChart3 className="w-4 h-4 text-pink-primary" />
            <span>Module 2 · Dynamic Grading Sandbox & Item Discrimination Audit</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {role === "professor" ? "Score Distribution, Cut-offs & Question Discrimination" : "My Final Grade & Assessment Contest"}
          </h2>
          <p className="text-xs text-pink-light/80 mt-0.5">
            Cohort: 100 Synthetic Students · Mean: 60.4 · SD: 10.6 · Human-In-Charge Approval Gate
          </p>
        </div>

        {/* Quick Mode Toggle (1-click) */}
        {role === "professor" && (
          <div className="flex items-center gap-2 bg-plum-950 p-1.5 rounded-xl border border-pink-primary/30">
            <button
              onClick={() => handleToggleMode("fixed")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${cutoffMode === "fixed" ? "bg-plum-800 text-white shadow" : "text-pink-light/70 hover:text-white"}`}
            >
              Fixed Z-Score
            </button>
            <button
              onClick={() => handleToggleMode("gap-aware")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${cutoffMode === "gap-aware" ? "bg-gradient-to-r from-pink-primary to-pink-glow text-plum-950 shadow" : "text-pink-light/70 hover:text-white"}`}
            >
              ⚡ Gap-Aware (3 Stranded)
            </button>
          </div>
        )}
      </div>

      {/* KPI Comparison Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-plum-900/70 border border-pink-primary/20">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-pink-light/70">Cutoff Mode</div>
          <div className="text-lg font-black text-pink-primary capitalize mt-0.5">{cutoffMode}</div>
          <div className="text-[10px] text-pink-light/60 mt-1">
            {cutoffMode === "gap-aware" ? "Optimized boundary shifts" : "Standard z-score formula"}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-plum-900/70 border border-pink-primary/20">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-pink-light/70">Within 1 Mark Below</div>
          <div className={`text-lg font-black mt-0.5 ${analysis.atBoundaryCount <= 3 ? "text-mint-good" : "text-coral-weak"}`}>
            {analysis.atBoundaryCount} Students
          </div>
          <div className="text-[10px] text-pink-light/60 mt-1">
            {analysis.atBoundaryCount <= 3 ? "Reduced from 15 in fixed mode" : "15 stranded on edge"}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-plum-900/70 border border-pink-primary/20">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-pink-light/70">Grade Boundary Shifts</div>
          <div className="text-lg font-black text-amber-secondary mt-0.5">{analysis.studentsShifted} Students</div>
          <div className="text-[10px] text-pink-light/60 mt-1">Promoted into higher grade band</div>
        </div>

        <div className="p-4 rounded-xl bg-plum-900/70 border border-pink-primary/20">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-pink-light/70">Audit Gate</div>
          <div className="text-lg font-black text-sky-info mt-0.5">Human in Charge</div>
          <div className="text-[10px] text-pink-light/60 mt-1">Requires instructor signature</div>
        </div>
      </div>

      {/* Main Sandbox Grid: Histogram with Cutoff sliders & Grade counts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Histogram + Cutoffs Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-plum-900/70 border border-pink-primary/30 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-pink-primary" />
                <span>Cohort Score Distribution & Boundary Cut-offs</span>
              </h3>
              <p className="text-xs text-pink-light/70">
                100 students: peak at 55-60 (26 students), spread 25 to 85
              </p>
            </div>
            <div className="text-xs font-bold text-amber-secondary">
              Mean: 60.4 · SD: 10.6
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(242,139,168,0.1)" />
                <XAxis dataKey="range" stroke="#BFA5AD" fontSize={11} />
                <YAxis stroke="#BFA5AD" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1B0F1C", borderColor: "#F28BA8", borderRadius: "0.75rem", fontSize: "12px" }}
                  formatter={(val: any) => [`${val} students`, "Cohort count"]}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {histogramData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isPeak ? "#F28BA8" : "rgba(242,139,168,0.4)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Draggable / Interactive Cut-off Sliders */}
          {role === "professor" && (
            <div className="p-4 rounded-xl bg-plum-950/80 border border-plum-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-primary flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Adjust Grade Cut-off Boundaries</span>
                </span>
                <span className="text-[11px] text-pink-light/60">
                  Moving sliders updates counts and stranded students live
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(
                  [
                    ["C", "C", 40, 50],
                    ["B", "B", 50, 60],
                    ["BPlus", "B+", 58, 66],
                    ["A", "A", 64, 72],
                    ["APlus", "A+", 70, 78],
                    ["O", "O", 76, 84],
                  ] as const
                ).map(([key, label, min, max]) => (
                  <div key={key} className="p-2.5 rounded-lg bg-plum-900/80 border border-plum-700/60 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">Grade {label}</span>
                      <span className="font-black text-amber-secondary">{activeCutoffs[key]}</span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={0.1}
                      value={activeCutoffs[key]}
                      onChange={(e) => handleCutoffSliderChange(key, parseFloat(e.target.value))}
                      className="w-full accent-pink-primary cursor-pointer h-1.5"
                    />
                  </div>
                ))}
              </div>

              {/* Approve Button (Human in charge) */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-pink-light/70 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-secondary" />
                  <span>No student record is modified until professor explicitly approves.</span>
                </span>
                <button
                  onClick={handleApproveChanges}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-pink-primary to-pink-glow text-plum-950 hover:brightness-110 shadow-[0_0_15px_rgba(242,139,168,0.4)] transition-all flex items-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Approve & Write to Audit Log</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Grade Distribution Breakdown Table */}
        <div className="p-6 rounded-2xl bg-plum-900/70 border border-pink-primary/30 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-mint-good" />
              <span>Grade Band Distribution</span>
            </h3>
            <p className="text-xs text-pink-light/70">
              Live counts recalculated against current cut-offs
            </p>
          </div>

          <div className="space-y-2">
            {[
              ["O", activeCutoffs.O, analysis.gradeCounts.O || 0, "text-pink-primary"],
              ["A+", activeCutoffs.APlus, analysis.gradeCounts["A+"] || 0, "text-amber-secondary"],
              ["A", activeCutoffs.A, analysis.gradeCounts.A || 0, "text-mint-good"],
              ["B+", activeCutoffs.BPlus, analysis.gradeCounts["B+"] || 0, "text-sky-info"],
              ["B", activeCutoffs.B, analysis.gradeCounts.B || 0, "text-pink-light"],
              ["C", activeCutoffs.C, analysis.gradeCounts.C || 0, "text-pink-light/80"],
              ["F", 0, analysis.gradeCounts.F || 0, "text-coral-weak"],
            ].map(([grade, cutoff, count, colorClass]) => (
              <div
                key={String(grade)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-plum-950 border border-plum-800 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className={`font-black text-sm ${colorClass}`}>Grade {grade}</span>
                  <span className="text-[10px] text-pink-light/50">
                    ({grade === "F" ? "< " + activeCutoffs.C : "≥ " + cutoff})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{count} students</span>
                  <span className="text-[10px] text-pink-light/60">({count}%)</span>
                </div>
              </div>
            ))}
          </div>

          {/* Student View Grade Display & Contest Grade Option */}
          {role === "student" && (
            <div className="p-4 rounded-xl bg-plum-950 border border-pink-primary/40 space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-pink-light/60">Your Final Grade</div>
                  <div className="text-2xl font-black text-amber-secondary">Grade {demoStudentGrade}</div>
                  <div className="text-xs text-pink-light/80">Score: {demoStudent.totalScore} / 100</div>
                </div>
                <button
                  onClick={() => setContestSubmitted(!contestSubmitted)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl bg-pink-primary/20 hover:bg-pink-primary/30 text-pink-primary border border-pink-primary/40 transition-all"
                >
                  Contest This Grade
                </button>
              </div>

              {contestSubmitted && (
                <div className="space-y-2 pt-2 border-t border-plum-800">
                  <span className="text-xs font-bold text-white">State reason for grade contest:</span>
                  <textarea
                    rows={2}
                    value={contestReason}
                    onChange={(e) => setContestReason(e.target.value)}
                    placeholder="e.g. Question 13 ambiguity affected final 0.2 marks below A+ cutoff..."
                    className="w-full p-2.5 rounded-lg bg-plum-900 border border-plum-700 text-xs text-white placeholder-pink-light/40 focus:outline-none focus:border-pink-primary"
                  />
                  <button
                    onClick={() => {
                      if (!contestReason) return onNotify("Please enter a reason", "error");
                      onContestGrade(contestReason);
                      setContestReason("");
                      setContestSubmitted(false);
                      onNotify("Grade contest request filed for instructor review.", "success");
                    }}
                    className="w-full py-2 text-xs font-bold rounded-lg bg-pink-primary text-plum-950 hover:brightness-110 flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Grade Contest Request</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Question Audit: Point-Biserial Discrimination Scatter Plot & Remediation Actions */}
      {role === "professor" && (
        <div className="p-6 rounded-2xl bg-plum-900/70 border border-pink-primary/30 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-coral-weak" />
                <span>Question Discrimination Audit (Point-Biserial r_pbis)</span>
              </h3>
              <p className="text-xs text-pink-light/70">
                14 Midterm Questions · Flag threshold at 0.15 · Q13 (-0.24) and Q14 (0.148) flagged
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-mint-good">
                <span className="w-2.5 h-2.5 rounded-full bg-mint-good" /> Strong &gt;0.15
              </span>
              <span className="flex items-center gap-1 text-amber-secondary">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-secondary" /> Low &lt;0.15
              </span>
              <span className="flex items-center gap-1 text-coral-weak">
                <span className="w-2.5 h-2.5 rounded-full bg-coral-weak" /> Negative (&lt;0)
              </span>
            </div>
          </div>

          {/* Scatter Plot */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(242,139,168,0.1)" />
                <XAxis dataKey="pVal" name="Difficulty (p-val)" domain={[0.2, 1.0]} stroke="#BFA5AD" fontSize={11} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                <YAxis dataKey="rPbis" name="Discrimination (r_pbis)" domain={[-0.3, 0.6]} stroke="#BFA5AD" fontSize={11} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{ backgroundColor: "#1B0F1C", borderColor: "#F28BA8", borderRadius: "0.75rem", fontSize: "12px" }}
                  formatter={(value: any, name: any) => [value, name === "rPbis" ? "Discrimination (r_pbis)" : "Proportion Correct"]}
                />
                <ReferenceLine y={0.15} stroke="#F2C46B" strokeDasharray="4 4" label={{ value: "0.15 Flag Threshold", fill: "#F2C46B", fontSize: 10 }} />
                <ReferenceLine y={0} stroke="#F2705A" strokeDasharray="2 2" />
                <Scatter name="Questions" data={scatterData} fill="#F28BA8">
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Flagged Questions Remediation Panel */}
          <div className="p-4 rounded-xl bg-plum-950 border border-coral-weak/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-coral-weak uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Flagged Questions Requiring Human Intervention (Q13 & Q14)</span>
              </span>
              <span className="text-[11px] text-pink-light/70">
                Action recalculates student grades immediately
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions.filter((q) => q.flagged || q.status !== "normal").map((q) => (
                <div key={q.id} className="p-3.5 rounded-lg bg-plum-900 border border-plum-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white">
                      Question {q.qNumber} (r = {q.rPbis.toFixed(3)})
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${q.status === "nullified" ? "bg-plum-800 text-pink-light" : q.status === "grace" ? "bg-mint-good/20 text-mint-good" : "bg-coral-weak/20 text-coral-weak"}`}>
                      {q.status === "nullified" ? "NULLIFIED" : q.status === "grace" ? `+${q.graceMarks} GRACE` : "FLAGGED"}
                    </span>
                  </div>

                  <p className="text-xs text-pink-light/80 line-clamp-2">{q.text}</p>
                  <p className="text-[11px] text-amber-secondary">{q.flagReason}</p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleQuestionRemediation(q.id, "nullify")}
                      disabled={q.status === "nullified"}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-plum-800 hover:bg-plum-700 text-pink-light border border-pink-primary/30 disabled:opacity-50"
                    >
                      Nullify Question
                    </button>
                    <button
                      onClick={() => handleQuestionRemediation(q.id, "grace")}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-mint-good/20 hover:bg-mint-good/30 text-mint-good border border-mint-good/40 flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Give +2 Grace Marks</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Student Grade Contests for Professor */}
          {contests.length > 0 && (
            <div className="p-4 rounded-xl bg-plum-950 border border-plum-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-secondary">
                Pending Student Grade Contests ({contests.filter((c) => c.status === "pending").length})
              </span>
              <div className="space-y-2">
                {contests.map((c) => (
                  <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-plum-900 text-xs gap-2">
                    <div>
                      <span className="font-bold text-white">{c.studentName}</span>
                      <span className="text-pink-light/60 ml-2">Requested: {c.requestedGrade} (Current: {c.currentGrade})</span>
                      <p className="text-[11px] text-pink-light/80 mt-0.5">"{c.reason}"</p>
                    </div>

                    {c.status === "pending" ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onResolveContest(c.id, "approved", "Approved by course instructor.");
                            onNotify(`Grade contest approved for ${c.studentName}.`, "success");
                          }}
                          className="px-3 py-1 rounded bg-mint-good/20 text-mint-good hover:bg-mint-good/30 font-bold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            onResolveContest(c.id, "rejected", "Rejected: Score threshold not satisfied.");
                            onNotify(`Grade contest rejected.`, "info");
                          }}
                          className="px-3 py-1 rounded bg-coral-weak/20 text-coral-weak hover:bg-coral-weak/30 font-bold"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`px-2.5 py-1 rounded font-bold capitalize ${c.status === "approved" ? "text-mint-good bg-mint-good/15" : "text-coral-weak bg-coral-weak/15"}`}>
                        {c.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
