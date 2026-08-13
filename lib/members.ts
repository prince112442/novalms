// lib/members.ts
// A "Profile" is a login (Supabase Auth + role). A "Member" is the library
// patron record loans attach to. They used to be unrelated — this bridges
// them so a logged-in student/lecturer can self-borrow without a librarian
// creating their member record by hand first.
import { prisma } from "@/lib/prisma";
import type { Profile } from "@prisma/client";

function codePrefixFor(role: string) {
  if (role === "LECTURER") return "LEC";
  if (role === "LIBRARIAN") return "LIB";
  if (role === "SUPER_ADMIN") return "ADM";
  return "STU";
}

function memberTypeFor(role: string): "STUDENT" | "LECTURER" | "STAFF" {
  if (role === "LECTURER") return "LECTURER";
  if (role === "LIBRARIAN" || role === "SUPER_ADMIN") return "STAFF";
  return "STUDENT";
}

// Finds the Member row linked to this profile, creating one on first use
// (e.g. the first time a student clicks "Borrow"). Falls back to matching
// by email for members a librarian already added by hand, and links them.
export async function getOrCreateMemberForProfile(profile: Profile) {
  const existing = await prisma.member.findUnique({ where: { profileId: profile.id } });
  if (existing) return existing;

  const byEmail = await prisma.member.findUnique({ where: { email: profile.email } });
  if (byEmail) {
    return prisma.member.update({ where: { id: byEmail.id }, data: { profileId: profile.id } });
  }

  const memberCode = `${codePrefixFor(profile.role)}-${profile.id.slice(0, 8).toUpperCase()}`;

  return prisma.member.create({
    data: {
      memberCode,
      fullName: profile.fullName,
      email: profile.email,
      memberType: memberTypeFor(profile.role),
      profileId: profile.id
    }
  });
}
