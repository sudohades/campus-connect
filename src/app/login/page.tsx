"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/session-context";
import { MOCK_USERS } from "@/data/users";

export default function LoginPage() {
  const { login, loading } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = await login(email, password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error ?? "Something went wrong.");
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col px-4 py-16 animate-fade-in">
      <div className="mb-2">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-crimson to-crimson-hover text-sm font-bold text-white shadow-glow-crimson/30">
          CC
        </span>
      </div>
      <h1 className="mt-4 text-2xl font-semibold text-neutral-50 tracking-tight">Welcome back</h1>
      <p className="mt-1.5 text-sm text-neutral-400">Log in with your ANU student email.</p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-neutral-400">
            University email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@anu.ac.ke"
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-neutral-400">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input-field"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400 animate-fade-in">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-crimson mt-1"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-crimson-light hover:text-crimson transition-colors">
          Register
        </Link>
      </p>

      <div className="mt-8 rounded-xl border border-dashed border-neutral-700 bg-surface-raised/50 p-3.5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
          Demo accounts
        </p>
        <ul className="space-y-1 text-xs text-neutral-400">
          {MOCK_USERS.map((u) => (
            <li key={u.id} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              {u.role.replace("_", " ")}: <span className="font-mono text-neutral-500">{u.email}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
