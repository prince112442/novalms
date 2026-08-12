import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/apiAuth";

export async function GET() {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const members = await prisma.member.findMany({ orderBy: { registeredAt: "desc" } });
    return NextResponse.json(members);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not load members" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const { memberCode, fullName, email, phone, memberType, department } = body;

  if (!memberCode || !fullName || !email || !memberType) {
    return NextResponse.json({ message: "memberCode, fullName, email and memberType are required" }, { status: 400 });
  }

  try {
    const member = await prisma.member.create({
      data: { memberCode, fullName, email, phone: phone || null, memberType, department: department || null }
    });
    return NextResponse.json({ id: member.id, message: "Member added" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not add member" }, { status: 500 });
  }
}
