"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { IconBook } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setError("Please confirm your email first — check your inbox for the confirmation link.");
      } else if (error.message.toLowerCase().includes("invalid login credentials")) {
        setError("Invalid email or password.");
      } else {
        setError(error.message);
      }
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-[380px] rounded-2xl bg-white p-7 shadow-2xl sm:p-9">
        <Link href="/" className="mb-6 flex items-center gap-2.5">
          <IconBook className="h-6 w-6 text-orange" />
          <h1 className="text-lg font-bold text-navy-900">LMS</h1>
        </Link>
        <h2 className="text-xl font-bold text-navy-900">Welcome back</h2>
        <p className="mb-5 mt-1 text-[13px] text-slate-500">Log in to manage your library.</p>

        {error && <div className="mb-2.5 text-[12.5px] text-rose-600">{error}</div>}

        <label className="mb-1.5 block text-[12.5px] font-semibold text-slate-700" htmlFor="email">Email</label>
        <Input
          id="email"
          type="email"
          required
          placeholder="admin@library.edu"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mb-4"
        />

        <label className="mb-1.5 block text-[12.5px] font-semibold text-slate-700" htmlFor="password">Password</label>
        <Input
          id="password"
          type="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-5"
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </Button>

        <p className="mt-5 text-center text-[13px] text-slate-500">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-orange-dark">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
