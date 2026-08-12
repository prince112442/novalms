import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/apiAuth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await req.json();
  const { fullName, email, phone, department, status } = body;

  try {
    await prisma.member.update({
      where: { id: Number(id) },
      data: { fullName, email, phone, department, status }
    });
    return NextResponse.json({ message: "Member updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not update member" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  try {
    await prisma.member.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Member deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not delete member" }, { status: 500 });
  }
}
