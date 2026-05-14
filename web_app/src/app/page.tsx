"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import ComplaintCard from "../components/Complaintcard";
import Sidebar from "../components/Sidebar";
import { ANDROID_APK_FILENAME, ANDROID_APK_URL } from "../lib/downloads";
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

export default function Home() {
  const [overview, setOverview] = useState<AdminOverview>(emptyOverview);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    void Promise.all([getAdminOverview(), getComplaints()])
      .then(([nextOverview, nextComplaints]) => {
        setOverview(nextOverview);
        setComplaints(nextComplaints.slice(0, 3));
      })
      .catch(() => {
        setOverview(emptyOverview);
        setComplaints([]);
      });
  }, []);

  const stats = [
    { label: "Open complaints", value: overview.totals.complaints },
    { label: "Pending", value: overview.totals.pending },
    { label: "Resolved", value: overview.totals.resolved },
  ];

  return (
    <div className="pb-14">
      <Navbar />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 md:px-10">
        <section className="section-grid items-start">
          <div className="glass-card rounded-[40px] p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent-dark)]">
              Civic issue resolution system
            </p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight">
              Report city problems, route them faster, and keep residents informed.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--ink-muted)]">
              UrbanEye brings together citizen reporting, admin visibility, and AI-assisted triage
              in the same workflow without changing your current stack.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-dark)]"
              >
                Open Dashboard
              </Link>
              <a
                href={ANDROID_APK_URL}
                download={ANDROID_APK_FILENAME}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-dark)]"
              >
                Download Android APK
              </a>
              <Link
                href="/register"
                className="rounded-full border border-[var(--border)] bg-white/75 px-6 py-3 text-sm font-semibold"
              >
                Create Citizen Account
              </Link>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[28px] border border-[var(--border)] bg-white/65 p-5">
                  <p className="text-sm text-[var(--ink-muted)]">{stat.label}</p>
                  <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
          <Sidebar />
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {complaints.length === 0 ? (
            <p className="rounded-[28px] border border-[var(--border)] bg-white/65 p-5 text-sm text-[var(--ink-muted)] md:col-span-3">
              No live complaints are available yet.
            </p>
          ) : null}
          {complaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </section>
      </main>
    </div>
  );
}
