"use client";

import { useEffect, useState } from "react";

import ComplaintCard from "./Complaintcard";
import MapComplaint from "./MapComplaint";
import ReportPanel from "./ReportPanel";
import { type AdminOverview, type Complaint } from "../lib/demoData";
import { getAdminOverview } from "../services/adminService";
import { getComplaints } from "../services/complaintService";

const emptyOverview: AdminOverview = {
  totals: {
    complaints: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    users: 0,
  },
  statusBreakdown: {},
  priorityBreakdown: {},
  departmentBreakdown: {},
  recentComplaints: [],
};

export default function DashboardShell() {
  const [overview, setOverview] = useState<AdminOverview>(emptyOverview);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [error, setError] = useState("");

  const load = () =>
    Promise.all([getAdminOverview(), getComplaints()])
      .then(([nextOverview, nextComplaints]) => {
        setOverview(nextOverview);
        setComplaints(nextComplaints);
        setError("");
      })
      .catch((loadError) => {
        setOverview(emptyOverview);
        setComplaints([]);
        setError(loadError instanceof Error ? loadError.message : "Unable to load live complaints.");
      });

  useEffect(() => {
    void load();
  }, []);

  const stats = [
    {
      label: "Open complaints",
      value: overview.totals.complaints,
      note: "Across live web and mobile reports",
    },
    {
      label: "Pending",
      value: overview.totals.pending,
      note: "Waiting for initial review",
    },
    {
      label: "In progress",
      value: overview.totals.inProgress,
      note: "Already routed to field teams",
    },
    {
      label: "Resolved",
      value: overview.totals.resolved,
      note: "Closed with action completed",
    },
  ];

  return (
    <div className="grid gap-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-[28px] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              {stat.label}
            </p>
            <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">{stat.note}</p>
          </div>
        ))}
      </section>
      <section>
        <ReportPanel onCreated={load} />
      </section>
      <section>
        <MapComplaint />
      </section>
      {error ? (
        <p className="rounded-[24px] border border-[var(--border)] bg-white/75 p-4 text-sm text-[var(--ink-muted)]">
          {error}
        </p>
      ) : null}
      <section className="grid gap-5 md:grid-cols-2">
        {complaints.length === 0 && !error ? (
          <p className="rounded-[24px] border border-[var(--border)] bg-white/75 p-4 text-sm text-[var(--ink-muted)]">
            No complaints have been submitted yet.
          </p>
        ) : null}
        {complaints.map((complaint) => (
          <ComplaintCard key={complaint.id} complaint={complaint} />
        ))}
      </section>
    </div>
  );
}
