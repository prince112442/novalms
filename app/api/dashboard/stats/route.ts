import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/apiAuth";

export async function GET() {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const [totalMembers, issuedBooks, totalBooksAgg, totalFineAgg] = await Promise.all([
      prisma.member.count(),
      prisma.issuedBook.count({ where: { status: { in: ["ISSUED", "OVERDUE"] } } }),
      prisma.book.aggregate({ _sum: { totalCopies: true } }),
      prisma.fine.aggregate({ _sum: { amount: true }, where: { status: "UNPAID" } })
    ]);

    return NextResponse.json({
      totalMembers, membersDelta: 0,
      issuedBooks, issuedDelta: 0,
      totalBooks: totalBooksAgg._sum.totalCopies ?? 0, totalBooksDelta: 0,
      totalFine: Number(totalFineAgg._sum.amount ?? 0), fineDelta: 0
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not load dashboard stats" }, { status: 500 });
  }
}
