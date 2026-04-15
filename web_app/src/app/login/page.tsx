"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { loginUser } from "../../services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setMessage("Enter both email and password to continue.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const response = await loginUser({ email, password });
      if (typeof window !== "undefined") {
        window.localStorage.setItem("urbaneye-user", JSON.stringify(response.user));
      }
      setMessage("Login successful. Opening dashboard...");
      router.push("/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 md:px-10">
      <div className="section-grid w-full">
        <section className="glass-card rounded-[36px] p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-dark)]">
            Citizen access
          </p>
          <h1 className="mt-4 text-4xl font-semibold">Welcome back to UrbanEye</h1>
          <p className="mt-4 max-w-xl text-[var(--ink-muted)]">
            Sign in to track complaints, review AI triage, and submit new civic issues from the
            same dashboard.
          </p>
          <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-white/65 p-5 text-sm text-[var(--ink-muted)]">
            Demo account: <span className="font-semibold text-[var(--foreground)]">citizen@urbaneye.dev</span>
            {" / "}
            <span className="font-semibold text-[var(--foreground)]">secret123</span>
          </div>
        </section>
        <section className="glass-card rounded-[36px] p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              className="w-full rounded-2xl border border-[var(--border)] bg-white/85 px-4 py-3 outline-none"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              className="w-full rounded-2xl border border-[var(--border)] bg-white/85 px-4 py-3 outline-none"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              className="w-full rounded-full bg-[var(--foreground)] px-5 py-3 text-white transition hover:bg-[var(--accent-dark)] disabled:opacity-60"
              disabled={submitting}
              type="submit"
            >
              {submitting ? "Signing in..." : "Login"}
            </button>
          </form>
          {message ? <p className="mt-4 text-sm text-[var(--ink-muted)]">{message}</p> : null}
          <p className="mt-5 text-sm text-[var(--ink-muted)]">
            Need an account?{" "}
            <Link href="/register" className="font-semibold text-[var(--foreground)]">
              Register here
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
