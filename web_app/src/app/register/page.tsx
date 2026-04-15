"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { registerUser } from "../../services/authService";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !email || !password) {
      setMessage("Fill in name, email, and password to create your account.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const response = await registerUser({ name, email, password });
      if (typeof window !== "undefined") {
        window.localStorage.setItem("urbaneye-user", JSON.stringify(response.user));
      }
      setMessage("Account created. Opening dashboard...");
      router.push("/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-12 md:px-10">
      <section className="glass-card w-full rounded-[36px] p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-dark)]">
          Create account
        </p>
        <h1 className="mt-4 text-4xl font-semibold">Start reporting civic issues in minutes</h1>
        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <input
            className="rounded-2xl border border-[var(--border)] bg-white/85 px-4 py-3 outline-none"
            placeholder="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            className="rounded-2xl border border-[var(--border)] bg-white/85 px-4 py-3 outline-none"
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className="rounded-2xl border border-[var(--border)] bg-white/85 px-4 py-3 outline-none"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            className="rounded-full bg-[var(--accent)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--accent-dark)] disabled:opacity-60"
            disabled={submitting}
            type="submit"
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>
        {message ? <p className="mt-4 text-sm text-[var(--ink-muted)]">{message}</p> : null}
        <p className="mt-5 text-sm text-[var(--ink-muted)]">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-[var(--foreground)]">
            Go to login
          </Link>
        </p>
      </section>
    </main>
  );
}
