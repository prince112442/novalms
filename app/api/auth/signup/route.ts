// app/api/auth/signup/route.ts
// Public self-serve signup for students. Creates a real Supabase Auth user
// (via the request-scoped server client, so a session cookie is set when
// email confirmation is off) plus the matching profile row the rest of the
// app reads roles from — same pairing scripts/create-admin.ts does by hand.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const fullName = body?.fullName?.trim();
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;

  if (!fullName || !email || !password) {
    return NextResponse.json({ message: "Full name, email and password are required" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
  }

  const existing = await prisma.profile.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: "An account with that email already exists" }, { status: 409 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });

  if (error || !data.user) {
    return NextResponse.json({ message: error?.message ?? "Could not create account" }, { status: 400 });
  }

  try {
    await prisma.profile.create({
      data: { id: data.user.id, fullName, email, role: "STUDENT" }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Account created but profile setup failed — contact the library." }, { status: 500 });
  }

  // If the Supabase project has email confirmation on, there's no session
  // yet — the client tells the person to check their inbox in that case.
  const needsEmailConfirmation = !data.session;

  return NextResponse.json({ message: "Account created", needsEmailConfirmation }, { status: 201 });
}
