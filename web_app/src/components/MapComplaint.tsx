import type { Complaint } from "../lib/demoData";

type Props = {
  complaints: Complaint[];
};

export default function MapComplaint({ complaints }: Props) {
  return (
    <div className="glass-card rounded-[32px] p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
            Map Snapshot
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Hotspots by locality</h2>
        </div>
        <span className="rounded-full bg-white/70 px-3 py-2 text-sm">
          {complaints.length} active markers
        </span>
      </div>
      <div className="relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-[linear-gradient(140deg,#dbeafe,#fef3c7,#fde68a)] p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {complaints.map((complaint, index) => (
            <div
              key={complaint.id}
              className="rounded-3xl bg-white/85 p-4 shadow-sm"
              style={{ transform: `translateY(${index % 2 === 0 ? "0px" : "10px"})` }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                Zone {index + 1}
              </p>
              <h3 className="mt-2 font-semibold">{complaint.location}</h3>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">{complaint.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
