import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const status = req.nextUrl.searchParams.get("status");
  try {
    const fines = await prisma.fine.findMany({
      where: status ? { status: status.toUpperCase() as "UNPAID" | "PAID" | "WAIVED" } : undefined,
      include: { member: true },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(fines.map(f => ({ ...f, amount: Number(f.amount) })));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not load fines" }, { status: 500 });
  }
}
