"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconBook } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "", role: "STUDENT" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: form.fullName, email: form.email, password: form.password, role: form.role })
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.message ?? "Could not create your account.");
      return;
    }

    if (data.needsEmailConfirmation) {
      setNotice("Account created! Check your email to confirm it, then log in.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-[400px] rounded-2xl bg-white p-7 shadow-2xl sm:p-9">
        <Link href="/" className="mb-6 flex items-center gap-2.5">
          <IconBook className="h-6 w-6 text-orange" />
          <h1 className="text-lg font-bold text-navy-900">LMS</h1>
        </Link>
        <h2 className="text-xl font-bold text-navy-900">Create your account</h2>
        <p className="mb-5 mt-1 text-[13px] text-slate-500">Sign up to browse the catalog and track your loans.</p>

        {error && <div className="mb-2.5 text-[12.5px] text-rose-600">{error}</div>}
        {notice && <div className="mb-2.5 text-[12.5px] text-emerald-600">{notice}</div>}

        <label className="mb-1.5 block text-[12.5px] font-semibold text-slate-700" htmlFor="fullName">Full name</label>
        <Input
          id="fullName"
          required
          placeholder="Ama Mensah"
          value={form.fullName}
          onChange={e => setForm({ ...form, fullName: e.target.value })}
          className="mb-4"
        />

        <label className="mb-1.5 block text-[12.5px] font-semibold text-slate-700" htmlFor="email">Email</label>
        <Input
          id="email"
          type="email"
          required
          placeholder="you@school.edu.gh"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="mb-4"
        />

        <label className="mb-1.5 block text-[12.5px] font-semibold text-slate-700" htmlFor="role">I am a</label>
        <select
          id="role"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
          className="mb-4 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-navy-900"
        >
          <option value="STUDENT">Student</option>
          <option value="LECTURER">Lecturer</option>
        </select>

        <label className="mb-1.5 block text-[12.5px] font-semibold text-slate-700" htmlFor="password">Password</label>
        <Input
          id="password"
          type="password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="mb-4"
        />

        <label className="mb-1.5 block text-[12.5px] font-semibold text-slate-700" htmlFor="confirmPassword">Confirm password</label>
        <Input
          id="confirmPassword"
          type="password"
          required
          minLength={8}
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
          className="mb-5"
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </Button>

        <p className="mt-5 text-center text-[13px] text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-orange-dark">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
