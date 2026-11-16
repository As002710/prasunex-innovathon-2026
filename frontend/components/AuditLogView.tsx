"use client";

import { AuditLogEntry } from "@/lib/types";
import { ShieldCheck, History, Clock, User, CheckCircle2 } from "lucide-react";

interface AuditLogViewProps {
  logs: AuditLogEntry[];
}

export function AuditLogView({ logs }: AuditLogViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-plum-900/80 border border-pink-primary/30 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-secondary">
          <History className="w-4 h-4 text-pink-primary" />
          <span>Institutional Transparency & Accountability</span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1">Grade Change & Cut-off Audit Trail</h2>
        <p className="text-xs text-pink-light/80 mt-0.5">
          Immutable log of every grade curve adjustment, question nullification, grace mark grant, and contest resolution.
        </p>
      </div>

      {/* Audit Log Table */}
      <div className="p-6 rounded-2xl bg-plum-900/70 border border-pink-primary/30 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-mint-good" />
            <span>Recorded Modifications ({logs.length})</span>
          </h3>
          <span className="text-xs text-pink-light/60">Sorted chronologically (Newest first)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="clean-table text-xs">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Instructor / Author</th>
                <th>Action</th>
                <th>Target Field</th>
                <th>Previous Value</th>
                <th>New Approved Value</th>
                <th>Reason / Rationale</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="text-pink-light/70 whitespace-nowrap font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-pink-primary" />
                      <span>{log.authorName}</span>
                    </div>
                    <div className="text-[10px] text-pink-light/60">{log.authorRole}</div>
                  </td>
                  <td>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-pink-primary/20 text-pink-primary border border-pink-primary/30">
                      {log.action}
                    </span>
                  </td>
                  <td className="font-semibold text-amber-secondary">{log.field}</td>
                  <td className="text-pink-light/60 font-mono text-[11px] max-w-xs truncate">{log.oldValue}</td>
                  <td className="text-mint-good font-mono font-bold text-[11px] max-w-xs truncate">{log.newValue}</td>
                  <td className="text-pink-light/80 italic text-[11px]">{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
