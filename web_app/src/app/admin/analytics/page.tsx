import Navbar from "../../../components/Navbar";

const metrics = [
  { label: "Average first response", value: "7.2h" },
  { label: "Resolution rate", value: "81%" },
  { label: "High priority backlog", value: "14" },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="pb-12">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 md:px-10">
        <section className="glass-card rounded-[36px] p-8">
          <h1 className="text-4xl font-semibold">Analytics</h1>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-[28px] border border-[var(--border)] bg-white/70 p-5">
                <p className="text-sm text-[var(--ink-muted)]">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold">{metric.value}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
