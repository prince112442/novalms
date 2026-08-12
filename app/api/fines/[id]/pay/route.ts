import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/apiAuth";

export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  try {
    await prisma.fine.update({
      where: { id: Number(id) },
      data: { status: "PAID", paidAt: new Date() }
    });
    return NextResponse.json({ message: "Fine marked as paid" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not update fine" }, { status: 500 });
  }
}
