"use client";

import { useEffect, useState } from "react";

import ComplaintCard from "./Complaintcard";
import MapComplaint from "./MapComplaint";
import ReportPanel from "./ReportPanel";
import { type AdminOverview, type Complaint, demoOverview } from "../lib/demoData";
import { getAdminOverview } from "../services/adminService";
import { getComplaints } from "../services/complaintService";

export default function DashboardShell() {
  const [overview, setOverview] = useState<AdminOverview>(demoOverview);
  const [complaints, setComplaints] = useState<Complaint[]>(demoOverview.recentComplaints);

  const load = () =>
    Promise.all([getAdminOverview(), getComplaints()]).then(([nextOverview, nextComplaints]) => {
      setOverview(nextOverview);
      setComplaints(nextComplaints);
    });

  useEffect(() => {
    void load();
  }, []);

  const stats = [
    { label: "Open complaints", value: overview.totals.complaints },
    { label: "Pending", value: overview.totals.pending },
    { label: "In progress", value: overview.totals.inProgress },
    { label: "Resolved", value: overview.totals.resolved },
  ];

  return (
    <div className="grid gap-8">
      <section className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-[28px] p-5">
            <p className="text-sm text-[var(--ink-muted)]">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </section>
      <section className="section-grid">
        <ReportPanel onCreated={load} />
        <MapComplaint complaints={complaints.slice(0, 3)} />
      </section>
      <section className="grid gap-5 md:grid-cols-2">
        {complaints.map((complaint) => (
          <ComplaintCard key={complaint.id} complaint={complaint} />
        ))}
      </section>
    </div>
  );
}
