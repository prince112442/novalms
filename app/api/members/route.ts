import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/apiAuth";

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
  // Only admins can manually add a member record — students get their own
  // member record automatically the first time they borrow a book.
  const { unauthorized } = await requireRole(["SUPER_ADMIN"]);
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
