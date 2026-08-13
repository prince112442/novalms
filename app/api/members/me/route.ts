import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/apiAuth";
import { getOrCreateMemberForProfile } from "@/lib/members";

// GET /api/members/me — the logged-in user's own library member record
// (id, memberCode, etc). Used by the Books page to self-borrow, and by
// the dashboard to fetch personalized recommendations.
export async function GET() {
  const { profile, unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const member = await getOrCreateMemberForProfile(profile!);
    return NextResponse.json(member);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not load your member record" }, { status: 500 });
  }
}
