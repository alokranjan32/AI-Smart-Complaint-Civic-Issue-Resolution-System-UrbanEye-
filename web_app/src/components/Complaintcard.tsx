import type { Complaint } from "../lib/demoData";

type Props = {
  complaint: Complaint;
};

export default function ComplaintCard({ complaint }: Props) {
  const latestHistoryEntry = complaint.history?.length
    ? [...complaint.history].sort(
        (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      )[0]
    : null;

  return (
    <article className="glass-card rounded-[28px] p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
            {complaint.category}
          </p>
          <h3 className="mt-2 text-xl font-semibold">{complaint.title}</h3>
        </div>
        <span className="rounded-full bg-[rgba(42,157,143,0.12)] px-3 py-1 text-xs font-semibold text-[var(--success)]">
          {complaint.status.replace("_", " ")}
        </span>
      </div>
      <p className="text-sm leading-6 text-[var(--ink-muted)]">{complaint.description}</p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <span className="rounded-full bg-white/70 px-3 py-1">{complaint.location}</span>
        <span className="rounded-full bg-[rgba(239,131,84,0.14)] px-3 py-1 text-[var(--accent-dark)]">
          Priority {complaint.priority}
        </span>
        {complaint.department ? (
          <span className="rounded-full bg-[rgba(20,33,61,0.08)] px-3 py-1">{complaint.department}</span>
        ) : null}
      </div>
      {complaint.suggestedAction ? (
        <p className="mt-4 text-sm leading-6 text-[var(--ink-muted)]">
          Suggested action: {complaint.suggestedAction}
        </p>
      ) : null}
      {complaint.assignedTo ? (
        <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">
          Assigned to: {complaint.assignedTo}
        </p>
      ) : null}
      {latestHistoryEntry ? (
        <div className="mt-4 rounded-[22px] bg-white/65 p-4 text-sm leading-6 text-[var(--ink-muted)]">
          <p className="font-semibold text-[var(--foreground)]">Latest update</p>
          <p className="mt-2">{latestHistoryEntry.message}</p>
          <p className="mt-2 text-xs">
            {new Date(latestHistoryEntry.createdAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
      ) : null}
    </article>
  );
}
