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

// Like requireAuth, but also checks the caller's role. Use this for anything
// students shouldn't be able to do (add/edit/delete books, etc).
// Example: const { profile, unauthorized } = await requireRole(["SUPER_ADMIN", "LIBRARIAN"]);
export async function requireRole(allowedRoles: string[]) {
  const { user, profile, unauthorized } = await requireAuth();
  if (unauthorized) return { user, profile, unauthorized };

  if (!profile || !allowedRoles.includes(profile.role)) {
    return {
      user,
      profile,
      unauthorized: NextResponse.json({ message: "You don't have permission to do that" }, { status: 403 })
    };
  }

  return { user, profile, unauthorized: null };
}
