import DashboardShell from "../../components/DashboardShell";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export default function DashboardPage() {
  return (
    <div className="pb-12">
      <Navbar />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 md:px-10">
        <section className="section-grid">
          <div className="glass-card rounded-[36px] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
              Operations board
            </p>
            <h1 className="mt-3 text-4xl font-semibold">Today&apos;s complaint flow at a glance</h1>
            <p className="mt-4 max-w-2xl text-[var(--ink-muted)]">
              Track incoming complaints, identify hotspots, and keep response teams aligned from
              one place.
            </p>
          </div>
          <Sidebar />
        </section>
        <DashboardShell />
      </main>
    </div>
  );
}
