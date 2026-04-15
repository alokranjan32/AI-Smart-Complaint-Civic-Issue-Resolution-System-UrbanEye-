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
      await createComplaint(form);
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
    <section className="glass-card rounded-[32px] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-dark)]">
        Report an issue
      </p>
      <h2 className="mt-2 text-2xl font-semibold">Send a complaint into the response queue</h2>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <input
          className="rounded-2xl border border-[var(--border)] bg-white/85 px-4 py-3 outline-none"
          placeholder="Issue title"
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
        />
        <textarea
          className="min-h-32 rounded-2xl border border-[var(--border)] bg-white/85 px-4 py-3 outline-none"
          placeholder="Describe what happened"
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
        />
        <input
          className="rounded-2xl border border-[var(--border)] bg-white/85 px-4 py-3 outline-none"
          placeholder="Location"
          value={form.location}
          onChange={(event) => updateField("location", event.target.value)}
        />
        <button
          className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-dark)] disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "Submitting..." : "Submit Complaint"}
        </button>
        {message ? <p className="text-sm text-[var(--ink-muted)]">{message}</p> : null}
      </form>
    </section>
  );
}
