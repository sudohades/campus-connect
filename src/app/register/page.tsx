"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Check } from "lucide-react";
import { register } from "@/lib/auth";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "buyer", label: "Buyer" },
  { value: "seller", label: "Seller" },
  { value: "service_provider", label: "Service Provider" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    studentId: "",
    password: "",
    role: "buyer" as UserRole,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSteps([]);
    setSubmitting(true);

    const result = await register(form, (step) => setSteps((prev) => [...prev, step]));

    setSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Registration failed.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-20 text-center animate-fade-in">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle2 className="h-7 w-7 text-emerald-400" />
        </div>
        <h1 className="text-lg font-semibold text-neutral-50">
          Registration Successful
        </h1>
        <p className="mt-1.5 max-w-xs text-sm text-neutral-400 leading-relaxed">
          Your account request has been submitted for verification. This is a demo — no
          data was actually saved.
        </p>
        <Link
          href="/login"
          className="btn-crimson mt-6"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col px-4 py-16 animate-fade-in">
      <div className="mb-2">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-crimson to-crimson-hover text-sm font-bold text-white shadow-glow-crimson/30">
          CC
        </span>
      </div>
      <h1 className="mt-4 text-2xl font-semibold text-neutral-50 tracking-tight">Create an account</h1>
      <p className="mt-1.5 text-sm text-neutral-400">
        Registration requires your official ANU student email address.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
        <Field label="Full name">
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="input-field"
            placeholder="Jane Wambui"
          />
        </Field>
        <Field label="University email">
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="input-field"
            placeholder="student@anu.ac.ke"
          />
        </Field>
        <Field label="Student ID">
          <input
            required
            value={form.studentId}
            onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
            className="input-field"
            placeholder="SCE/1234/22"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="input-field"
            placeholder="••••••••"
          />
        </Field>
        <Field label="I want to">
          <div className="flex gap-2">
            {ROLE_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setForm((f) => ({ ...f, role: opt.value }))}
                className={cn(
                  "flex-1 rounded-xl border px-2 py-2.5 text-xs font-medium transition-all duration-150",
                  form.role === opt.value
                    ? "border-crimson/30 bg-crimson/10 text-crimson-light shadow-sm"
                    : "border-neutral-700 text-neutral-400 hover:bg-surface-elevated",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Field>

        {error && (
          <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400 animate-fade-in">{error}</p>
        )}

        {steps.length > 0 && (
          <div className="rounded-xl bg-surface-elevated border border-neutral-800 p-3.5 text-xs text-neutral-400 animate-slide-up">
            {steps.map((step, i) => {
              const isLast = i === steps.length - 1 && submitting;
              return (
                <p key={i} className="flex items-center gap-2 py-0.5">
                  {isLast ? (
                    <Loader2 className="h-3 w-3 animate-spin text-crimson-light" />
                  ) : (
                    <Check className="h-3 w-3 text-emerald-400" />
                  )}
                  {step}
                </p>
              );
            })}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-crimson mt-1"
        >
          {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-neutral-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-crimson-light hover:text-crimson transition-colors">
          Log in
        </Link>
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-neutral-400">{label}</label>
      {children}
    </div>
  );
}
