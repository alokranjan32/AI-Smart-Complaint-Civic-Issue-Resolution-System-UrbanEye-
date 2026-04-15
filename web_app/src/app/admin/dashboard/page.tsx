import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import DashboardShell from "../../../components/DashboardShell";

export default function AdminDashboardPage() {
  return (
    <div className="pb-12">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 md:px-10">
        <section className="section-grid">
          <div className="glass-card rounded-[36px] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
              Admin console
            </p>
            <h1 className="mt-3 text-4xl font-semibold">Command center for urban operations</h1>
            <p className="mt-4 max-w-2xl text-[var(--ink-muted)]">
              Review triaged complaints, monitor response metrics, and keep departments aligned.
            </p>
          </div>
          <Sidebar />
        </section>
        <DashboardShell />
      </main>
    </div>
  );
}
