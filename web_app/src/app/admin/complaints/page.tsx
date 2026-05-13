"use client";

import { useEffect, useMemo, useState } from "react";

import Navbar from "../../../components/Navbar";
import {
  getAdminComplaint,
  getAdminComplaints,
  updateAdminComplaint,
  type ComplaintWorkflowPayload,
} from "../../../services/adminService";
import { type Complaint } from "../../../lib/demoData";

const STATUS_OPTIONS = ["PENDING", "IN_PROGRESS", "RESOLVED"];

function formatDate(value?: string) {
  if (!value) {
    return "Not available";
  }

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<ComplaintWorkflowPayload>({
    status: "PENDING",
    department: "",
    assignedTo: "",
    note: "",
  });

  const loadComplaints = async () => {
    setLoading(true);
    const nextComplaints = await getAdminComplaints();
    setComplaints(nextComplaints);

    const nextSelectedId = selectedId || nextComplaints[0]?.id || "";
    setSelectedId(nextSelectedId);

    if (nextSelectedId) {
      const detailedComplaint = await getAdminComplaint(nextSelectedId);
      setSelectedComplaint(detailedComplaint);
      setForm({
        status: detailedComplaint.status,
        department: detailedComplaint.department || "",
        assignedTo: detailedComplaint.assignedTo || "",
        note: detailedComplaint.adminNote || "",
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    void loadComplaints();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    const loadSelectedComplaint = async () => {
      const detailedComplaint = await getAdminComplaint(selectedId);
      setSelectedComplaint(detailedComplaint);
      setForm({
        status: detailedComplaint.status,
        department: detailedComplaint.department || "",
        assignedTo: detailedComplaint.assignedTo || "",
        note: detailedComplaint.adminNote || "",
      });
    };

    void loadSelectedComplaint();
  }, [selectedId]);

  const openCount = useMemo(
    () => complaints.filter((complaint) => complaint.status !== "RESOLVED").length,
    [complaints],
  );

  const saveWorkflow = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedId) {
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const updatedComplaint = await updateAdminComplaint(selectedId, form);
      setSelectedComplaint(updatedComplaint);
      setComplaints((currentComplaints) =>
        currentComplaints.map((complaint) =>
          complaint.id === updatedComplaint.id ? updatedComplaint : complaint,
        ),
      );
      setMessage("Complaint workflow updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update complaint.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-12">
      <Navbar />
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 md:px-10">
        <section className="grid gap-5 md:grid-cols-3">
          <div className="glass-card rounded-[32px] p-6">
            <p className="text-sm text-[var(--ink-muted)]">Complaints tracked</p>
            <p className="mt-3 text-4xl font-semibold">{complaints.length}</p>
          </div>
          <div className="glass-card rounded-[32px] p-6">
            <p className="text-sm text-[var(--ink-muted)]">Still open</p>
            <p className="mt-3 text-4xl font-semibold">{openCount}</p>
          </div>
          <div className="glass-card rounded-[32px] p-6">
            <p className="text-sm text-[var(--ink-muted)]">Resolved</p>
            <p className="mt-3 text-4xl font-semibold">{complaints.length - openCount}</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-card rounded-[32px] p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
                  Complaint queue
                </p>
                <h1 className="mt-2 text-3xl font-semibold">Admin workflow board</h1>
              </div>
              <button
                className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                onClick={() => void loadComplaints()}
                type="button"
              >
                Refresh
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              {loading ? (
                <div className="rounded-[24px] bg-white/70 p-5 text-sm text-[var(--ink-muted)]">
                  Loading complaints...
                </div>
              ) : null}

              {complaints.map((complaint) => (
                <button
                  key={complaint.id}
                  className={`rounded-[24px] border p-5 text-left transition ${
                    selectedId === complaint.id
                      ? "border-[var(--foreground)] bg-white shadow-sm"
                      : "border-[var(--border)] bg-white/70 hover:bg-white"
                  }`}
                  onClick={() => {
                    setSelectedId(complaint.id);
                    setMessage("");
                  }}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-dark)]">
                        {complaint.category}
                      </p>
                      <h2 className="mt-2 text-xl font-semibold">{complaint.title}</h2>
                    </div>
                    <span className="rounded-full bg-[rgba(20,33,61,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                      {complaint.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">{complaint.location}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-[rgba(239,131,84,0.14)] px-3 py-1 text-[var(--accent-dark)]">
                      Priority {complaint.priority}
                    </span>
                    {complaint.department ? (
                      <span className="rounded-full bg-[rgba(20,33,61,0.08)] px-3 py-1">
                        {complaint.department}
                      </span>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <section className="glass-card rounded-[32px] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
                    Workflow detail
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold">
                    {selectedComplaint?.title || "Select a complaint"}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-muted)]">
                    {selectedComplaint?.description || "Pick a complaint from the queue to manage status, assignment, and notes."}
                  </p>
                </div>
                {selectedComplaint ? (
                  <div className="rounded-[24px] border border-[var(--border)] bg-white/70 px-4 py-3 text-sm">
                    <p className="font-semibold">{selectedComplaint.location}</p>
                    <p className="mt-1 text-[var(--ink-muted)]">
                      Last updated {formatDate(selectedComplaint.updatedAt)}
                    </p>
                  </div>
                ) : null}
              </div>

              {selectedComplaint ? (
                <form className="mt-6 grid gap-4" onSubmit={saveWorkflow}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-semibold">
                      Status
                      <select
                        className="rounded-2xl border border-[var(--border)] bg-white/85 px-4 py-3"
                        value={form.status}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, status: event.target.value }))
                        }
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="grid gap-2 text-sm font-semibold">
                      Department
                      <input
                        className="rounded-2xl border border-[var(--border)] bg-white/85 px-4 py-3"
                        value={form.department || ""}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, department: event.target.value }))
                        }
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-semibold">
                      Assigned officer or desk
                      <input
                        className="rounded-2xl border border-[var(--border)] bg-white/85 px-4 py-3"
                        value={form.assignedTo || ""}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, assignedTo: event.target.value }))
                        }
                      />
                    </label>

                    <div className="rounded-[24px] border border-[var(--border)] bg-white/70 p-4 text-sm text-[var(--ink-muted)]">
                      <p className="font-semibold text-[var(--foreground)]">Citizen</p>
                      <p className="mt-2">{selectedComplaint.user?.name || "Citizen user"}</p>
                      <p>{selectedComplaint.user?.email || "Email unavailable"}</p>
                    </div>
                  </div>

                  <label className="grid gap-2 text-sm font-semibold">
                    Admin note
                    <textarea
                      className="min-h-32 rounded-2xl border border-[var(--border)] bg-white/85 px-4 py-3"
                      value={form.note || ""}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, note: event.target.value }))
                      }
                    />
                  </label>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-dark)] disabled:opacity-60"
                      disabled={saving}
                      type="submit"
                    >
                      {saving ? "Saving..." : "Update complaint workflow"}
                    </button>
                    {message ? <p className="text-sm text-[var(--ink-muted)]">{message}</p> : null}
                  </div>
                </form>
              ) : null}
            </section>

            <section className="glass-card rounded-[32px] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
                Timeline
              </p>
              <h3 className="mt-2 text-2xl font-semibold">Complaint history</h3>
              <div className="mt-6 grid gap-4">
                {(selectedComplaint?.history || []).length ? (
                  [...(selectedComplaint?.history || [])]
                    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
                    .map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-[24px] border border-[var(--border)] bg-white/70 p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-sm font-semibold">
                            {entry.actorName} · {entry.actorRole}
                          </p>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                            {entry.type.replace("_", " ")}
                          </p>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">{entry.message}</p>
                        {entry.note ? (
                          <div className="mt-3 rounded-[18px] bg-[rgba(20,33,61,0.05)] p-4 text-sm leading-6 text-[var(--ink-muted)]">
                            {entry.note}
                          </div>
                        ) : null}
                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                          {entry.toStatus ? (
                            <span className="rounded-full bg-[rgba(42,157,143,0.14)] px-3 py-1 text-[var(--success)]">
                              {entry.toStatus.replace("_", " ")}
                            </span>
                          ) : null}
                          {entry.department ? (
                            <span className="rounded-full bg-[rgba(20,33,61,0.08)] px-3 py-1">
                              {entry.department}
                            </span>
                          ) : null}
                          {entry.assignedTo ? (
                            <span className="rounded-full bg-[rgba(239,131,84,0.14)] px-3 py-1 text-[var(--accent-dark)]">
                              {entry.assignedTo}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-4 text-xs text-[var(--ink-muted)]">{formatDate(entry.createdAt)}</p>
                      </div>
                    ))
                ) : (
                  <div className="rounded-[24px] bg-white/70 p-5 text-sm text-[var(--ink-muted)]">
                    No workflow history has been recorded yet for this complaint.
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
