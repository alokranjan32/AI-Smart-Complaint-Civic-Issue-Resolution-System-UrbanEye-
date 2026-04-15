import Navbar from "../../components/Navbar";

export default function ProfilePage() {
  return (
    <div className="pb-12">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 md:px-10">
        <section className="glass-card rounded-[36px] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
            Citizen profile
          </p>
          <h1 className="mt-3 text-4xl font-semibold">Resident account snapshot</h1>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[28px] border border-[var(--border)] bg-white/70 p-5">
              <p className="text-sm text-[var(--ink-muted)]">Name</p>
              <p className="mt-2 text-xl font-semibold">Aarav Singh</p>
            </div>
            <div className="rounded-[28px] border border-[var(--border)] bg-white/70 p-5">
              <p className="text-sm text-[var(--ink-muted)]">Email</p>
              <p className="mt-2 text-xl font-semibold">citizen@urbaneye.dev</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
