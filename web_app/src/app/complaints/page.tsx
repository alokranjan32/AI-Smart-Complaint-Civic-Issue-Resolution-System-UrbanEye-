import Navbar from "../../components/Navbar";
import ReportPanel from "../../components/ReportPanel";
import DashboardShell from "../../components/DashboardShell";

export default function ComplaintsPage() {
  return (
    <div className="pb-12">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 md:px-10">
        <section className="grid gap-8">
          <div className="glass-card rounded-[36px] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
              Complaint registry
            </p>
            <h1 className="mt-3 text-4xl font-semibold">Citizen reporting and live triage</h1>
          </div>
          <ReportPanel />
          <DashboardShell />
        </section>
      </main>
    </div>
  );
}
