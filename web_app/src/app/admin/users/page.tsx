"use client";

import { useEffect, useState } from "react";

import Navbar from "../../../components/Navbar";
import { type User } from "../../../lib/demoData";
import { getAdminUsers } from "../../../services/adminService";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getAdminUsers().then(setUsers);
  }, []);

  return (
    <div className="pb-12">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 md:px-10">
        <section className="glass-card rounded-[36px] p-8">
          <h1 className="text-4xl font-semibold">Users</h1>
          <div className="mt-8 grid gap-4">
            {users.map((user) => (
              <div key={user.email} className="rounded-[24px] border border-[var(--border)] bg-white/70 p-5">
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-sm text-[var(--ink-muted)]">{user.email}</p>
                <p className="mt-2 inline-block rounded-full bg-[rgba(20,33,61,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                  {user.role}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
