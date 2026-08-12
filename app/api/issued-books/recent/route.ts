import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/apiAuth";

function toDisplayStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase(); // ISSUED -> Issued
}

export async function GET() {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const rows = await prisma.issuedBook.findMany({
      include: { book: true, member: true },
      orderBy: { issueDate: "desc" },
      take: 5
    });

    return NextResponse.json(
      rows.map(r => ({
        title: r.book.title,
        member: r.member.fullName,
        issueDate: r.issueDate.toISOString().slice(0, 10),
        dueDate: r.dueDate.toISOString().slice(0, 10),
        status: toDisplayStatus(r.status)
      }))
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not load recently issued books" }, { status: 500 });
  }
}
