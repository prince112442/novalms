import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/apiAuth";

export async function GET() {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const rows = await prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 5 });
    return NextResponse.json(
      rows.map(r => ({ iconName: "check", text: `${r.actorName} ${r.action}`, time: r.createdAt }))
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not load recent activity" }, { status: 500 });
  }
}
