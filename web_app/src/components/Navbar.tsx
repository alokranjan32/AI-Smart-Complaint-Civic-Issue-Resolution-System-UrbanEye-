"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/complaints", label: "Complaints" },
  { href: "/admin/dashboard", label: "Admin" },
  { href: "/map", label: "Map" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 px-6 py-4 md:px-10">
      <div className="glass-card urbaneye-navbar mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-3 md:px-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="urbaneye-navbar-mark" />
          <span className="text-lg font-semibold tracking-[0.18em] uppercase">UrbanEye</span>
        </Link>
        <nav className="hidden items-center gap-2 text-sm font-medium text-[var(--ink-muted)] md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 transition ${
                pathname === link.href
                  ? "bg-[rgba(20,33,61,0.08)] text-[var(--foreground)]"
                  : "hover:bg-white/70 hover:text-[var(--foreground)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/login"
          className="rounded-full bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-white shadow-[0_12px_30px_rgba(20,33,61,0.18)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-dark)]"
        >
          Citizen Login
        </Link>
      </div>
    </header>
  );
}
