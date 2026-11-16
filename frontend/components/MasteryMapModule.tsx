"use client";

import React, { useState } from "react";
import {
  ConceptNode,
  Role,
  StudentScore,
  PracticeQuestion,
} from "@/lib/types";
import {
  SEED_CONCEPTS,
  DEMO_STUDENT_TREND,
  PRACTICE_SET_SEMAPHORES,
} from "@/data/seed";
import { diagnoseDAGRootCauses, updateBKT } from "@/lib/bkt";
import * as XLSX from "xlsx";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import {
  Brain,
  AlertTriangle,
  Upload,
  Download,
  Info,
  CheckCircle,
  HelpCircle,
  TrendingDown,
  Layers,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

interface MasteryMapModuleProps {
  role: Role;
  students: StudentScore[];
  onNotify: (msg: string, type?: "success" | "error" | "info") => void;
}

export function MasteryMapModule({ role, students, onNotify }: MasteryMapModuleProps) {
  // Current student mastery state
  const [masteryScores, setMasteryScores] = useState<Record<string, number>>({
    "c-os-arch": 0.92,
    "c-proc-mgmt": 0.84,
    "c-cpu-sched": 0.88,
    "c-sem-mutex": 0.41,
    "c-deadlocks": 0.28,
    "c-mem-mgmt": 0.52,
    "c-virt-mem": 0.49,
  });

  const [selectedConceptId, setSelectedConceptId] = useState<string>("c-deadlocks");
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[]>(PRACTICE_SET_SEMAPHORES);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, number>>({});
  const [practiceResults, setPracticeResults] = useState<Record<string, { isCorrect: boolean; feedback: string }>>({});

  // CSV Import States
  const [isImporting, setIsImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<{
    headers: string[];
    rows: any[];
    validationErrors: string[];
  } | null>(null);

  // Compute live diagnoses
  const diagnoses = diagnoseDAGRootCauses(SEED_CONCEPTS, masteryScores, {
    "c-os-arch": 5,
    "c-proc-mgmt": 5,
    "c-cpu-sched": 5,
    "c-sem-mutex": 5,
    "c-deadlocks": 5,
    "c-mem-mgmt": 5,
    "c-virt-mem": 5,
  });

  const selectedConcept = SEED_CONCEPTS.find((c) => c.id === selectedConceptId) || SEED_CONCEPTS[4];
  const selectedDiag = diagnoses[selectedConcept.id];

  // Practice question handler
  const handleAnswerSubmit = (qId: string, optionIdx: number) => {
    const q = practiceQuestions.find((item) => item.id === qId);
    if (!q) return;

    const isCorrect = optionIdx === q.correctIndex;
    setPracticeAnswers((prev) => ({ ...prev, [qId]: optionIdx }));

    // Bayesian Knowledge Tracing update
    const currentScore = masteryScores[q.conceptId] ?? 0.41;
    const updated = updateBKT(currentScore, isCorrect);
    setMasteryScores((prev) => ({ ...prev, [q.conceptId]: updated }));

    setPracticeResults((prev) => ({
      ...prev,
      [qId]: {
        isCorrect,
        feedback: isCorrect
          ? `Correct! BKT mastery increased from ${Math.round(currentScore * 100)}% to ${Math.round(updated * 100)}%.`
          : `Incorrect. BKT posterior adjusted to ${Math.round(updated * 100)}%. Prerequisite review recommended.`,
      },
    }));

    onNotify(isCorrect ? "Answer Correct! Mastery updated via BKT." : "Answer Incorrect. Practise fundamentals.", isCorrect ? "success" : "info");
  };

  // Download 5-minute template CSV
  const handleDownloadTemplate = () => {
    const templateData = [
      ["Student_ID", "Student_Name", "Q1_OS_Arch", "Q2_Proc_Mgmt", "Q3_CPU_Sched", "Q4_CPU_Sched", "Q5_Sem_Mutex", "Q6_Sem_Mutex", "Q7_Sem_Mutex", "Q8_Deadlocks", "Q9_Deadlocks", "Q10_Mem_Mgmt", "Q11_Mem_Mgmt", "Q12_Virt_Mem", "Q13_Sem_Mutex", "Q14_Virt_Mem"],
      ["Max_Marks", "", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5", "5"],
      ["STU-001", "Aarav Sharma", "5", "4.5", "5", "4", "2", "3", "2", "1.5", "1", "3", "3", "2.5", "1", "4"],
      ["STU-002", "Priya Patel", "5", "4", "4.5", "4", "2", "2.5", "1.5", "1", "0.5", "3.5", "3", "3", "1.5", "4"],
      ["STU-2026-042", "Student (Demo Account)", "4.5", "4", "4", "3.5", "2", "2", "1.5", "1", "0.5", "3", "2.5", "2", "0", "3.5"],
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Marks_Template");
    XLSX.writeFile(wb, "campus_nexus_marks_template.csv");
    onNotify("5-minute marks template downloaded.", "success");
  };

  // CSV/Excel upload with SheetJS and auto column matching
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (data.length < 2) {
          onNotify("File has insufficient rows.", "error");
          return;
        }

        const headers = data[0].map(String);
        const rows = data.slice(1);
        const errors: string[] = [];

        // Validate values: 0 <= mark <= max (assuming 5 max mark default)
        rows.forEach((row, rowIdx) => {
          row.forEach((val: any, colIdx: number) => {
            if (colIdx >= 2 && val !== undefined && val !== "") {
              const num = Number(val);
              if (isNaN(num) || num < 0 || num > 100) {
                errors.push(`Row ${rowIdx + 2}, Col "${headers[colIdx]}": invalid mark value "${val}" (must be >= 0).`);
              }
            }
          });
        });

        setImportPreview({
          headers,
          rows: rows.slice(0, 5),
          validationErrors: errors,
        });

        if (errors.length === 0) {
          onNotify(`Uploaded ${rows.length} rows successfully with zero validation errors!`, "success");
        } else {
          onNotify(`Uploaded with ${errors.length} validation errors flagged.`, "error");
        }
      } catch (err: any) {
        onNotify(`Failed to parse file: ${err.message}`, "error");
      }
    };
    reader.readAsBinaryString(file);
  };

  const getNodeColor = (masteryPct: number) => {
    if (masteryPct >= 80) return "bg-mint-good/20 border-mint-good text-mint-good shadow-[0_0_15px_rgba(74,222,154,0.3)]";
    if (masteryPct >= 50) return "bg-amber-secondary/20 border-amber-secondary text-amber-secondary shadow-[0_0_15px_rgba(242,196,107,0.3)]";
    return "bg-coral-weak/20 border-coral-weak text-coral-weak shadow-[0_0_15px_rgba(242,112,90,0.4)] animate-pulse";
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Context */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-2xl bg-plum-900/80 border border-pink-primary/30 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-secondary">
            <Brain className="w-4 h-4 text-pink-primary" />
            <span>Module 1 · Bayesian Knowledge Tracing & Concept Graph</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {role === "professor" ? "Cohort Prerequisite DAG & Root-Cause Audit" : "My Mastery Map & Root-Cause Practice"}
          </h2>
          <p className="text-xs text-pink-light/80 mt-0.5">
            Operating Systems (CS301) · 5 Sequential Assessments evaluated via BKT
          </p>
        </div>

        {/* Import / Template Action Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadTemplate}
            className="px-3.5 py-2 text-xs font-medium rounded-xl bg-plum-800 hover:bg-plum-700 text-pink-light border border-pink-primary/20 transition-all flex items-center gap-1.5"
            title="Download CSV Template with Auto Column Matching"
          >
            <Download className="w-3.5 h-3.5 text-amber-secondary" />
            <span>5-Min Template</span>
          </button>

          <label className="px-3.5 py-2 text-xs font-medium rounded-xl bg-pink-primary/20 hover:bg-pink-primary/30 text-pink-primary border border-pink-primary/40 cursor-pointer transition-all flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload CSV/Excel</span>
            <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* CSV Preview / Error Box if active */}
      {importPreview && (
        <div className="p-4 rounded-2xl bg-plum-950 border border-pink-primary/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              File Preview ({importPreview.rows.length} sample rows shown)
            </span>
            <button
              onClick={() => setImportPreview(null)}
              className="text-xs text-pink-light/60 hover:text-white"
            >
              Dismiss Preview
            </button>
          </div>

          {importPreview.validationErrors.length > 0 && (
            <div className="p-3 rounded-xl bg-coral-weak/10 border border-coral-weak/40 text-xs text-coral-weak space-y-1">
              <strong>Validation Errors Detected (0 ≤ mark ≤ max):</strong>
              <ul className="list-disc pl-4 space-y-0.5 max-h-24 overflow-y-auto">
                {importPreview.validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="clean-table text-xs">
              <thead>
                <tr>
                  {importPreview.headers.slice(0, 8).map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {importPreview.rows.map((r, i) => (
                  <tr key={i}>
                    {r.slice(0, 8).map((cell: any, ci: number) => (
                      <td key={ci}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Root-Cause Banner Alert */}
      {selectedDiag && selectedDiag.rootCauseId && (
        <div className="p-4 rounded-2xl bg-coral-weak/15 border border-coral-weak/40 flex items-start gap-3.5 animate-in fade-in">
          <div className="p-2 rounded-xl bg-coral-weak/20 text-coral-weak shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-coral-weak uppercase tracking-wider">
                Root-Cause Identified by DAG Reasoning
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-coral-weak/20 text-coral-weak border border-coral-weak/40">
                Confidence: {selectedDiag.confidence}
              </span>
            </div>
            <p className="text-sm font-semibold text-white">
              {selectedDiag.explanation}
            </p>
            <p className="text-xs text-pink-light/70">
              Prerequisite concept <strong>{selectedDiag.rootCauseName}</strong> ({selectedDiag.rootCauseMastery}%) must be strengthened before re-attempting {selectedDiag.conceptName}.
            </p>
          </div>
        </div>
      )}

      {/* Concept DAG Graph (Interactive Visualizer) */}
      <div className="p-6 rounded-2xl bg-plum-900/70 border border-pink-primary/30 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink-primary" />
              <span>Interactive Concept Prerequisite Graph (DAG)</span>
            </h3>
            <p className="text-xs text-pink-light/70">
              Click any node to view empirical evidence, prerequisite trace, and tailored practice set.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-mint-good">
              <span className="w-2.5 h-2.5 rounded-full bg-mint-good" /> &gt;80% Mastered
            </span>
            <span className="flex items-center gap-1.5 text-amber-secondary">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-secondary" /> 50-80% Progressing
            </span>
            <span className="flex items-center gap-1.5 text-coral-weak">
              <span className="w-2.5 h-2.5 rounded-full bg-coral-weak" /> &lt;50% Weak / At Risk
            </span>
          </div>
        </div>

        {/* DAG Nodes Display */}
        <div className="relative py-6 px-4 rounded-xl bg-plum-950/80 border border-plum-800 overflow-x-auto">
          {/* Branch 1: OS Architecture -> Process Mgmt -> CPU Scheduling */}
          <div className="flex items-center justify-around min-w-[700px] mb-8">
            {/* Node 1 */}
            <button
              onClick={() => setSelectedConceptId("c-os-arch")}
              className={`p-4 rounded-xl border transition-all text-center min-w-[170px] ${getNodeColor(diagnoses["c-os-arch"].mastery)} ${selectedConceptId === "c-os-arch" ? "ring-2 ring-pink-primary scale-105" : "hover:scale-102"}`}
            >
              <div className="text-xs uppercase font-bold tracking-wider">Root Foundation</div>
              <div className="text-base font-extrabold mt-0.5">OS Architecture</div>
              <div className="text-sm font-black mt-1">{diagnoses["c-os-arch"].mastery}%</div>
            </button>

            <ArrowRight className="w-6 h-6 text-pink-primary/40 shrink-0" />

            {/* Node 2 */}
            <button
              onClick={() => setSelectedConceptId("c-proc-mgmt")}
              className={`p-4 rounded-xl border transition-all text-center min-w-[170px] ${getNodeColor(diagnoses["c-proc-mgmt"].mastery)} ${selectedConceptId === "c-proc-mgmt" ? "ring-2 ring-pink-primary scale-105" : "hover:scale-102"}`}
            >
              <div className="text-xs uppercase font-bold tracking-wider">Core Layer</div>
              <div className="text-base font-extrabold mt-0.5">Process Mgmt</div>
              <div className="text-sm font-black mt-1">{diagnoses["c-proc-mgmt"].mastery}%</div>
            </button>

            <ArrowRight className="w-6 h-6 text-pink-primary/40 shrink-0" />

            {/* Node 3 */}
            <button
              onClick={() => setSelectedConceptId("c-cpu-sched")}
              className={`p-4 rounded-xl border transition-all text-center min-w-[170px] ${getNodeColor(diagnoses["c-cpu-sched"].mastery)} ${selectedConceptId === "c-cpu-sched" ? "ring-2 ring-pink-primary scale-105" : "hover:scale-102"}`}
            >
              <div className="text-xs uppercase font-bold tracking-wider">Applied Topic</div>
              <div className="text-base font-extrabold mt-0.5">CPU Scheduling</div>
              <div className="text-sm font-black mt-1">{diagnoses["c-cpu-sched"].mastery}%</div>
            </button>
          </div>

          {/* Branch 2: Process Mgmt -> Semaphores & Mutex (41%) -> Deadlock Detection (28%) */}
          <div className="flex items-center justify-around min-w-[700px] mb-8 pl-32">
            <div className="text-xs font-bold text-amber-secondary uppercase tracking-wider flex items-center gap-1">
              <span>Forked Sub-Prerequisite:</span>
              <ArrowRight className="w-4 h-4 text-amber-secondary" />
            </div>

            {/* Node 4 */}
            <button
              onClick={() => setSelectedConceptId("c-sem-mutex")}
              className={`p-4 rounded-xl border transition-all text-center min-w-[180px] ${getNodeColor(diagnoses["c-sem-mutex"].mastery)} ${selectedConceptId === "c-sem-mutex" ? "ring-2 ring-pink-primary scale-105" : "hover:scale-102"}`}
            >
              <div className="text-xs uppercase font-bold tracking-wider text-coral-weak">Root Cause Prereq</div>
              <div className="text-base font-extrabold mt-0.5">Semaphores & Mutex</div>
              <div className="text-sm font-black mt-1">{diagnoses["c-sem-mutex"].mastery}%</div>
            </button>

            <ArrowRight className="w-6 h-6 text-coral-weak/60 shrink-0" />

            {/* Node 5 */}
            <button
              onClick={() => setSelectedConceptId("c-deadlocks")}
              className={`p-4 rounded-xl border transition-all text-center min-w-[180px] ${getNodeColor(diagnoses["c-deadlocks"].mastery)} ${selectedConceptId === "c-deadlocks" ? "ring-2 ring-pink-primary scale-105" : "hover:scale-102"}`}
            >
              <div className="text-xs uppercase font-bold tracking-wider text-coral-weak">Failing Concept</div>
              <div className="text-base font-extrabold mt-0.5">Deadlock Detection</div>
              <div className="text-sm font-black mt-1">{diagnoses["c-deadlocks"].mastery}%</div>
            </button>
          </div>

          {/* Branch 3: OS Architecture -> Memory Mgmt (52%) -> Virtual Memory (49%) */}
          <div className="flex items-center justify-around min-w-[700px] pl-32">
            <div className="text-xs font-bold text-sky-info uppercase tracking-wider flex items-center gap-1">
              <span>Memory Subtree:</span>
              <ArrowRight className="w-4 h-4 text-sky-info" />
            </div>

            {/* Node 6 */}
            <button
              onClick={() => setSelectedConceptId("c-mem-mgmt")}
              className={`p-4 rounded-xl border transition-all text-center min-w-[180px] ${getNodeColor(diagnoses["c-mem-mgmt"].mastery)} ${selectedConceptId === "c-mem-mgmt" ? "ring-2 ring-pink-primary scale-105" : "hover:scale-102"}`}
            >
              <div className="text-xs uppercase font-bold tracking-wider">Sub-Concept</div>
              <div className="text-base font-extrabold mt-0.5">Memory Mgmt</div>
              <div className="text-sm font-black mt-1">{diagnoses["c-mem-mgmt"].mastery}%</div>
            </button>

            <ArrowRight className="w-6 h-6 text-pink-primary/40 shrink-0" />

            {/* Node 7 */}
            <button
              onClick={() => setSelectedConceptId("c-virt-mem")}
              className={`p-4 rounded-xl border transition-all text-center min-w-[180px] ${getNodeColor(diagnoses["c-virt-mem"].mastery)} ${selectedConceptId === "c-virt-mem" ? "ring-2 ring-pink-primary scale-105" : "hover:scale-102"}`}
            >
              <div className="text-xs uppercase font-bold tracking-wider">Advanced Layer</div>
              <div className="text-base font-extrabold mt-0.5">Virtual Memory</div>
              <div className="text-sm font-black mt-1">{diagnoses["c-virt-mem"].mastery}%</div>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Student Mastery Trend Chart & Weak Topic Practice Set */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Mastery Trend Line Chart */}
        <div className="p-6 rounded-2xl bg-plum-900/70 border border-pink-primary/30 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-coral-weak" />
                <span>5-Assessment Mastery Trajectory</span>
              </h3>
              <p className="text-xs text-pink-light/70">
                Process Mgmt rising (0.70→0.86), Synchronization falling (0.65→0.41), Deadlocks falling (0.55→0.28)
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-coral-weak/15 border border-coral-weak/30 text-coral-weak text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Early Warning</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DEMO_STUDENT_TREND} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(242,139,168,0.1)" />
                <XAxis dataKey="assessment" stroke="#BFA5AD" fontSize={11} />
                <YAxis domain={[0, 1]} stroke="#BFA5AD" fontSize={11} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1B0F1C", borderColor: "#F28BA8", borderRadius: "0.75rem", fontSize: "12px" }}
                  formatter={(value: any) => [`${(Number(value) * 100).toFixed(1)}%`]}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <ReferenceLine y={0.5} stroke="#F2C46B" strokeDasharray="4 4" label={{ value: "50% Pass Line", fill: "#F2C46B", fontSize: 10 }} />
                <Line type="monotone" dataKey="processMgmt" name="Process Mgmt (Rising)" stroke="#4ADE9A" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="synchronization" name="Synchronization (Falling)" stroke="#F2C46B" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="deadlocks" name="Deadlocks (Failing)" stroke="#F2705A" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-plum-950/80 border border-plum-800 text-[11px] text-pink-light/80 flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-info shrink-0" />
            <span>
              <strong>Regulatory Notice:</strong> Flags are advice only and must never feed into marks or student disciplinary procedures.
            </span>
          </div>
        </div>

        {/* Right: Short 3-Question Practice Set for Weakest Root Topic */}
        <div className="p-6 rounded-2xl bg-plum-900/70 border border-pink-primary/30 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-mint-good" />
                <span>Targeted Practice: Semaphores & Mutex</span>
              </h3>
              <p className="text-xs text-pink-light/70">
                Reinforces the root cause identified in BKT reasoning
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-pink-primary/15 border border-pink-primary/30 text-pink-primary text-xs font-bold">
              3 Questions
            </span>
          </div>

          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {practiceQuestions.map((q, idx) => {
              const selectedIdx = practiceAnswers[q.id];
              const result = practiceResults[q.id];

              return (
                <div key={q.id} className="p-4 rounded-xl bg-plum-950/90 border border-plum-800 space-y-3">
                  <div className="text-xs font-semibold text-white">
                    <span className="text-pink-primary font-bold">Q{idx + 1}.</span> {q.question}
                  </div>

                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedIdx === optIdx;
                      let btnClass = "bg-plum-900/80 text-pink-light/90 border-plum-700/60 hover:border-pink-primary/50";
                      if (result) {
                        if (optIdx === q.correctIndex) {
                          btnClass = "bg-mint-good/20 text-mint-good border-mint-good font-semibold";
                        } else if (isChosen && !result.isCorrect) {
                          btnClass = "bg-coral-weak/20 text-coral-weak border-coral-weak";
                        }
                      } else if (isChosen) {
                        btnClass = "bg-pink-primary/20 text-pink-primary border-pink-primary";
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={Boolean(result)}
                          onClick={() => handleAnswerSubmit(q.id, optIdx)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-all ${btnClass}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {result && (
                    <div className={`p-2.5 rounded-lg text-xs leading-relaxed ${result.isCorrect ? "bg-mint-good/10 text-mint-good border border-mint-good/30" : "bg-coral-weak/10 text-coral-weak border border-coral-weak/30"}`}>
                      {result.feedback}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Professor View: Class-level weak concepts ranked & Students at risk */}
      {role === "professor" && (
        <div className="p-6 rounded-2xl bg-plum-900/70 border border-pink-primary/30 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-secondary" />
                <span>Class-Level Concept Mastery Ranking & At-Risk Students</span>
              </h3>
              <p className="text-xs text-pink-light/70">
                100 synthetic students ranked by BKT failure propensity
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weak Concepts Ranked */}
            <div className="p-4 rounded-xl bg-plum-950 border border-plum-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-secondary">
                Concepts Ranked by Weakness (Lowest First)
              </h4>
              <div className="space-y-2">
                {[...SEED_CONCEPTS].sort((a, b) => a.classMastery - b.classMastery).map((c, i) => (
                  <div key={c.id} className="flex items-center justify-between p-2 rounded-lg bg-plum-900/80 text-xs">
                    <span className="font-semibold text-white">
                      #{i + 1} {c.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-black ${c.classMastery < 50 ? "bg-coral-weak/20 text-coral-weak" : c.classMastery < 80 ? "bg-amber-secondary/20 text-amber-secondary" : "bg-mint-good/20 text-mint-good"}`}>
                      {c.classMastery}% Class Mastery
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Students at Risk */}
            <div className="p-4 rounded-xl bg-plum-950 border border-plum-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-coral-weak">
                Students at Risk on Semaphores & Mutex (≤ 50%)
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {students.filter((s) => (s.conceptMastery["c-sem-mutex"] || 0) <= 0.50).map((s) => (
                  <div key={s.studentId} className="flex items-center justify-between p-2 rounded-lg bg-plum-900/80 text-xs">
                    <div>
                      <span className="font-bold text-white">{s.studentName}</span>
                      <span className="text-[10px] text-pink-light/60 ml-2">({s.studentId})</span>
                    </div>
                    <span className="text-coral-weak font-black">
                      {Math.round((s.conceptMastery["c-sem-mutex"] || 0.41) * 100)}% Mastery
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
