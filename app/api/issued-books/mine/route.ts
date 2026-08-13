import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/apiAuth";
import { getOrCreateMemberForProfile } from "@/lib/members";

// GET /api/issued-books/mine — the logged-in user's own loans (current +
// history), newest first. Powers the "My Borrowed Books" list on the
// Books page so students can see what they have out and when it's due.
export async function GET() {
  const { profile, unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const member = await getOrCreateMemberForProfile(profile!);
    const loans = await prisma.issuedBook.findMany({
      where: { memberId: member.id },
      include: { book: true },
      orderBy: { issueDate: "desc" }
    });
    return NextResponse.json(loans);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not load your borrowed books" }, { status: 500 });
  }
}
