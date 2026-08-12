// lib/apiAuth.ts
// Small helper every API route calls first: confirms there's a logged-in
// Supabase session and loads their profile (for role checks / activity logs).
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null, unauthorized: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  return { user, profile, unauthorized: null };
}
