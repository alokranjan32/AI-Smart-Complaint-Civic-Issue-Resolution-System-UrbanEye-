import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Operations Overview" },
  { href: "/complaints", label: "All Complaints" },
  { href: "/admin/dashboard", label: "Admin Console" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default function Sidebar() {
  return (
    <aside className="glass-card rounded-[32px] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
        Quick Navigation
      </p>
      <div className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-2xl border border-[var(--border)] bg-white/60 px-4 py-3 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
