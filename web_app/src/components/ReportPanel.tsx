"use client";

import { useState } from "react";

import { createComplaint } from "../services/complaintService";

type Props = {
  onCreated?: () => void;
};

export default function ReportPanel({ onCreated }: Props) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const savedUser = window.localStorage.getItem("urbaneye-user");
      const user = savedUser ? (JSON.parse(savedUser) as { id?: string }) : null;
      await createComplaint({ ...form, userId: user?.id });
      setMessage("Complaint submitted and routed for triage.");
      setForm({ title: "", description: "", location: "" });
      onCreated?.();
    } catch {
      setMessage("Unable to submit complaint right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="glass-card rounded-[32px] p-6 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-dark)]">
            Report an issue
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Send a complaint into the response queue</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--ink-muted)]">
            Add a clear title, explain what residents are seeing on the ground, and pin the
            location so it shows up properly for both the admin team and the live map.
          </p>
        </div>
        <div className="rounded-[22px] border border-[var(--border)] bg-white/70 px-4 py-3 text-sm text-[var(--ink-muted)]">
          Live triage enabled
        </div>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <input
          className="rounded-2xl border border-[var(--border)] bg-white/88 px-4 py-3.5 outline-none transition focus:border-[rgba(20,33,61,0.24)] focus:bg-white"
          placeholder="Issue title"
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
        />
        <textarea
          className="min-h-40 rounded-2xl border border-[var(--border)] bg-white/88 px-4 py-3.5 outline-none transition focus:border-[rgba(20,33,61,0.24)] focus:bg-white"
          placeholder="Describe what happened"
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
        />
        <input
          className="rounded-2xl border border-[var(--border)] bg-white/88 px-4 py-3.5 outline-none transition focus:border-[rgba(20,33,61,0.24)] focus:bg-white"
          placeholder="Location"
          value={form.location}
          onChange={(event) => updateField("location", event.target.value)}
        />
        <button
          className="rounded-full bg-[var(--foreground)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(20,33,61,0.18)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-dark)] disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "Submitting..." : "Submit Complaint"}
        </button>
        {message ? (
          <p className="rounded-2xl bg-white/75 px-4 py-3 text-sm text-[var(--ink-muted)]">
            {message}
          </p>
        ) : null}
      </form>
    </section>
  );
}
