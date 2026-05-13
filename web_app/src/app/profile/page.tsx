"use client";

import { useState } from "react";

import Navbar from "../../components/Navbar";
import { type User } from "../../lib/demoData";

export default function ProfilePage() {
  const [user] = useState<User | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const savedUser = window.localStorage.getItem("urbaneye-user");
    return savedUser ? (JSON.parse(savedUser) as User) : null;
  });

  return (
    <div className="pb-12">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 md:px-10">
        <section className="glass-card rounded-[36px] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
            Citizen profile
          </p>
          <h1 className="mt-3 text-4xl font-semibold">Resident account snapshot</h1>
          {user ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] border border-[var(--border)] bg-white/70 p-5">
                <p className="text-sm text-[var(--ink-muted)]">Name</p>
                <p className="mt-2 text-xl font-semibold">{user.name}</p>
              </div>
              <div className="rounded-[28px] border border-[var(--border)] bg-white/70 p-5">
                <p className="text-sm text-[var(--ink-muted)]">Email</p>
                <p className="mt-2 text-xl font-semibold">{user.email}</p>
              </div>
            </div>
          ) : (
            <p className="mt-8 rounded-[28px] border border-[var(--border)] bg-white/70 p-5 text-[var(--ink-muted)]">
              No signed-in account found. Log in or create an account to see your profile here.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
