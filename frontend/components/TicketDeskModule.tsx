"use client";

import React, { useState } from "react";
import { Ticket, Role } from "@/lib/types";
import { calculateTicketPriority, evaluateSLA, generatePriorityChartData } from "@/lib/priority";
import { findDuplicateTicket, DEFAULT_DUPLICATE_THRESHOLD } from "@/lib/similarity";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  Wrench,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Send,
  Camera,
  FastForward,
  Filter,
  Shield,
  Layers,
  Flame,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

interface TicketDeskModuleProps {
  role: Role;
  tickets: Ticket[];
  onNewTicket: (params: {
    place: string;
    locationType: "lab" | "hostel" | "classroom" | "other";
    text: string;
    imageUrl?: string;
  }) => { isDuplicate: boolean; matchedTicketId?: string; similarityScore: number };
  onUpdateStatus: (ticketId: string, status: Ticket["status"]) => void;
  onSimulateTime: (hours: number) => void;
  onNotify: (msg: string, type?: "success" | "error" | "info") => void;
}

export function TicketDeskModule({
  role,
  tickets,
  onNewTicket,
  onUpdateStatus,
  onSimulateTime,
  onNotify,
}: TicketDeskModuleProps) {
  // Submission Form State
  const [place, setPlace] = useState("Lab 2, Bench 14");
  const [locationType, setLocationType] = useState<"lab" | "hostel" | "classroom" | "other">("lab");
  const [description, setDescription] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Filters & Admin Settings
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(DEFAULT_DUPLICATE_THRESHOLD);

  // Time Forward Simulated Total Hours
  const [simulatedHoursAdded, setSimulatedHoursAdded] = useState(0);

  // Handle Photo Upload with face blurring note
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      onNotify("Photo loaded. Faces automatically blurred for privacy protection.", "info");
    }
  };

  // Submit Ticket Handler
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      return onNotify("Please describe the issue.", "error");
    }

    const result = onNewTicket({
      place,
      locationType,
      text: description,
      imageUrl: photoPreview || undefined,
    });

    if (result.isDuplicate) {
      onNotify(
        `Joined existing ticket ${result.matchedTicketId} (${(result.similarityScore * 100).toFixed(0)}% semantic match). Report count increased & priority elevated!`,
        "success"
      );
    } else {
      onNotify("New ticket filed successfully with SLA tracking initialized.", "success");
    }

    setDescription("");
    setPhotoPreview(null);
  };

  // Simulate Time Forward
  const handleAdvanceTime = (hours: number) => {
    setSimulatedHoursAdded((prev) => prev + hours);
    onSimulateTime(hours);
    onNotify(`Advanced time forward by +${hours} hours. SLA clocks updated live!`, "info");
  };

  // Filtered & Sorted Tickets
  const displayTickets = tickets
    .filter((t) => (statusFilter === "all" ? true : t.status === statusFilter))
    .filter((t) => (locationFilter === "all" ? true : t.locationType === locationFilter))
    .sort((a, b) => b.currentPriority - a.currentPriority);

  // Priority formula chart data
  const priorityChartData = generatePriorityChartData(10);

  // Top repeated fault spots
  const repeatSpots: Record<string, number> = {};
  tickets.forEach((t) => {
    repeatSpots[t.place] = (repeatSpots[t.place] || 0) + t.reportsCount;
  });
  const topRepeatSpots = Object.entries(repeatSpots)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-2xl bg-plum-900/80 border border-pink-primary/30 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-secondary">
            <Wrench className="w-4 h-4 text-pink-primary" />
            <span>Module 3 · Smart Ticket Desk & SLA Escalation Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {role === "admin" ? "Campus Facility Queue & Priority Radar" : "Report a Campus Issue & Track SLA"}
          </h2>
          <p className="text-xs text-pink-light/80 mt-0.5">
            Formula: priority = base × log₂(1 + reports) × (1 + 0.1 × hours_open) · Semantic Deduplication (Threshold {similarityThreshold})
          </p>
        </div>

        {/* Admin SLA Simulation Controls */}
        {role === "admin" && (
          <div className="flex items-center gap-2 bg-plum-950 p-1.5 rounded-xl border border-pink-primary/30">
            <span className="text-[11px] font-bold text-pink-light/80 pl-2 flex items-center gap-1">
              <FastForward className="w-3.5 h-3.5 text-amber-secondary" />
              <span>Simulate Time:</span>
            </span>
            <button
              onClick={() => handleAdvanceTime(12)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-plum-800 hover:bg-plum-700 text-pink-primary transition-all"
            >
              +12h
            </button>
            <button
              onClick={() => handleAdvanceTime(24)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-plum-800 hover:bg-plum-700 text-amber-secondary transition-all"
            >
              +24h
            </button>
            <button
              onClick={() => handleAdvanceTime(48)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-coral-weak to-pink-primary text-plum-950 hover:brightness-110 transition-all"
            >
              +48h
            </button>
          </div>
        )}
      </div>

      {/* Two Column Layout: Submit Ticket Form & Ticket Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student Submission Form & SLA Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl bg-plum-900/70 border border-pink-primary/30 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-pink-primary" />
              <span>Submit a Ticket</span>
            </h3>
            <p className="text-xs text-pink-light/70">
              Pick the place, upload photo evidence, and describe the fault. Similar tickets are merged automatically.
            </p>

            <form onSubmit={handleSubmitTicket} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-white mb-1">Location / Place</label>
                <select
                  value={place}
                  onChange={(e) => {
                    setPlace(e.target.value);
                    if (e.target.value.toLowerCase().includes("hostel")) {
                      setLocationType("hostel");
                    } else if (e.target.value.toLowerCase().includes("lab")) {
                      setLocationType("lab");
                    } else if (e.target.value.toLowerCase().includes("class")) {
                      setLocationType("classroom");
                    } else {
                      setLocationType("other");
                    }
                  }}
                  className="w-full p-2.5 rounded-xl bg-plum-950 border border-plum-800 text-xs text-white focus:outline-none focus:border-pink-primary"
                >
                  <option value="Lab 2, Bench 14">Lab 2, Bench 14 (Power socket area)</option>
                  <option value="Lab 2, Rack 3">Lab 2, Rack 3 (Network Switch)</option>
                  <option value="Hostel Block B, Wing 2">Hostel Block B, Wing 2 (Room B-204)</option>
                  <option value="Hostel Block A, 3rd Floor">Hostel Block A, 3rd Floor (Water Dispenser)</option>
                  <option value="Library, 2nd Floor Reference">Library, 2nd Floor Reference (AC unit)</option>
                  <option value="Classroom 302">Classroom 302 (Audio / Mic)</option>
                  <option value="Sports Complex">Sports Complex (Badminton Hall)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1">Issue Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Power socket sparking on Bench 14 and emitting burning smell..."
                  className="w-full p-2.5 rounded-xl bg-plum-950 border border-plum-800 text-xs text-white placeholder-pink-light/40 focus:outline-none focus:border-pink-primary"
                />
              </div>

              {/* Photo Upload with Preview */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1">Photo Upload</label>
                <label className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-pink-primary/40 bg-plum-950/80 hover:bg-plum-950 cursor-pointer transition-all">
                  <Camera className="w-6 h-6 text-pink-primary/70 mb-1" />
                  <span className="text-xs font-medium text-pink-light">Click to upload photo evidence</span>
                  <span className="text-[10px] text-pink-light/60 mt-0.5">
                    Faces will be automatically blurred to preserve privacy
                  </span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>

                {photoPreview && (
                  <div className="relative mt-2 rounded-xl overflow-hidden border border-pink-primary/40 h-28">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 right-1 px-2 py-0.5 bg-black/80 rounded text-[9px] text-mint-good">
                      ✓ Privacy Blur Active
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-primary to-pink-glow text-plum-950 text-xs font-bold hover:brightness-110 shadow-[0_0_15px_rgba(242,139,168,0.4)] transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </form>
          </div>

          {/* SLA Standard Reference Card */}
          <div className="p-4 rounded-xl bg-plum-950/80 border border-plum-800 space-y-2 text-xs">
            <span className="font-bold text-amber-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Institutional SLA Policies</span>
            </span>
            <ul className="space-y-1.5 text-pink-light/80 text-[11px]">
              <li className="flex items-center justify-between">
                <span>Computer Labs & Academics:</span>
                <strong className="text-white">48 Hours SLA</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>Student Hostels & Living:</span>
                <strong className="text-white">24 Hours SLA</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>Breached SLA (&gt;Target):</span>
                <strong className="text-coral-weak">Auto-escalate to HoD</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>Critical Breached (&gt;72h):</span>
                <strong className="text-pink-primary">Escalate to Dean</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Columns: Live Priority Queue & Priority Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-plum-900/70 border border-pink-primary/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-pink-primary" />
              <span className="font-bold text-white">Filter Queue:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-1.5 rounded-lg bg-plum-950 border border-plum-800 text-white focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="p-1.5 rounded-lg bg-plum-950 border border-plum-800 text-white focus:outline-none"
              >
                <option value="all">All Locations</option>
                <option value="lab">Computer Labs</option>
                <option value="hostel">Hostels</option>
                <option value="classroom">Classrooms</option>
                <option value="other">Library / Campus</option>
              </select>
            </div>

            <div className="text-pink-light/70 font-semibold">
              Showing {displayTickets.length} active tickets (Sorted by Priority)
            </div>
          </div>

          {/* Ticket Cards List */}
          <div className="space-y-3.5 max-h-[560px] overflow-y-auto pr-1">
            {displayTickets.map((t) => {
              const sla = evaluateSLA(t.locationType, t.hoursOpen);
              const isOverdueLab = t.id === "tkt-104";

              return (
                <div
                  key={t.id}
                  className={`p-4 rounded-xl border transition-all ${isOverdueLab ? "bg-plum-900/90 border-coral-weak shadow-[0_0_20px_rgba(242,112,90,0.25)] ring-1 ring-coral-weak" : "bg-plum-950/80 border-plum-800 hover:border-pink-primary/40"}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-plum-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-black bg-plum-900 border border-plum-700 text-white">
                        {t.ticketNumber}
                      </span>
                      <span className="text-xs font-bold text-amber-secondary">{t.place}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-pink-primary/10 text-pink-primary border border-pink-primary/20">
                        {t.locationType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Priority Score & Bar */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-plum-900 border border-plum-700">
                        <Flame className="w-3.5 h-3.5 text-pink-primary" />
                        <span className="text-xs font-black text-pink-primary">{t.currentPriority}</span>
                        <span className="text-[10px] text-pink-light/60">Priority</span>
                      </div>

                      {/* Status Dropdown for Admin */}
                      {role === "admin" ? (
                        <select
                          value={t.status}
                          onChange={(e) => onUpdateStatus(t.id, e.target.value as any)}
                          className="px-2 py-1 text-xs font-bold rounded-lg bg-plum-900 border border-plum-700 text-white focus:outline-none"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      ) : (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${t.status === "resolved" ? "bg-mint-good/20 text-mint-good" : t.status === "in_progress" ? "bg-amber-secondary/20 text-amber-secondary" : "bg-sky-info/20 text-sky-info"}`}>
                          {t.status.replace("_", " ")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Text & Evidence */}
                  <div className="py-2.5 space-y-2">
                    <p className="text-xs text-white leading-relaxed">{t.text}</p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-pink-light/70">
                      <span>
                        Reporter: <strong>{t.studentName}</strong>
                      </span>
                      <span>
                        Reports Count: <strong className="text-pink-primary">{t.reportsCount} students</strong>
                      </span>
                      <span>
                        Hours Open: <strong>{t.hoursOpen}h</strong>
                      </span>
                    </div>

                    {/* Similar Reports merged pill */}
                    {t.similarReports.length > 0 && (
                      <div className="p-2 rounded-lg bg-plum-900/60 border border-plum-800 text-[10px] text-pink-light/80 space-y-1">
                        <div className="font-bold text-amber-secondary flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          <span>Merged Near-Duplicates ({t.similarReports.length} additional reports):</span>
                        </div>
                        {t.similarReports.map((sr, idx) => (
                          <div key={idx} className="pl-4 italic">
                            "{sr.text}" — {sr.studentName}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SLA Countdown & Escalation Footer */}
                  <div className={`p-2.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1.5 ${sla.isBreached ? "bg-coral-weak/15 border border-coral-weak/30 text-coral-weak" : "bg-plum-900/80 text-pink-light/90"}`}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-bold">
                        {sla.isBreached
                          ? `SLA Breached! ${t.hoursOpen - sla.slaTargetHours}h Overdue`
                          : `SLA Target: ${sla.remainingHours}h remaining of ${sla.slaTargetHours}h`}
                      </span>
                    </div>

                    <div className="font-black">
                      {sla.escalationLabel}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Admin Priority Formula Chart: "Priority rises with repeats and waiting" */}
          {role === "admin" && (
            <div className="p-6 rounded-2xl bg-plum-900/70 border border-pink-primary/30 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-pink-primary" />
                  <span>Priority Rises with Repeats and Waiting</span>
                </h3>
                <p className="text-xs text-pink-light/70">
                  Priority = base × log₂(1 + reports) × (1 + 0.1 × hours_open) plotted from 1 to 10 reports
                </p>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priorityChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(242,139,168,0.1)" />
                    <XAxis dataKey="reports" name="Reports" stroke="#BFA5AD" fontSize={11} label={{ value: "Reports Count", position: "insideBottom", offset: -5, fill: "#BFA5AD", fontSize: 10 }} />
                    <YAxis stroke="#BFA5AD" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1B0F1C", borderColor: "#F28BA8", borderRadius: "0.75rem", fontSize: "12px" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Line type="monotone" dataKey="newTicket" name="New (0h Open)" stroke="#7CC8EE" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="open24h" name="24h Open" stroke="#F2C46B" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="open48h" name="48h Overdue" stroke="#F28BA8" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Repeat-Fault Spots Table */}
              <div className="p-4 rounded-xl bg-plum-950 border border-plum-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-secondary">
                  Frequent Repeat-Fault Locations (Top Spots)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {topRepeatSpots.map(([spot, count], idx) => (
                    <div key={spot} className="flex items-center justify-between p-2 rounded-lg bg-plum-900 text-xs">
                      <span className="font-semibold text-white">#{idx + 1} {spot}</span>
                      <span className="px-2 py-0.5 rounded bg-pink-primary/20 text-pink-primary font-black">
                        {count} reports
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
