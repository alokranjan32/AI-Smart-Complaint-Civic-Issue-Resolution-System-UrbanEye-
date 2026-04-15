import Link from "next/link";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/complaints", label: "Complaints" },
  { href: "/admin/dashboard", label: "Admin" },
  { href: "/map", label: "Map" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 px-6 py-5 md:px-10">
      <div className="glass-card mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3">
        <Link href="/" className="text-lg font-semibold tracking-[0.18em] uppercase">
          UrbanEye
        </Link>
        <nav className="hidden gap-5 text-sm font-medium text-[var(--ink-muted)] md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[var(--foreground)]">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/login"
          className="rounded-full bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--accent-dark)]"
        >
          Citizen Login
        </Link>
      </div>
    </header>
  );
}
