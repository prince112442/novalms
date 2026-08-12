import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/apiAuth";

// GET /api/recommendations/popular — trending books library-wide, no
// external AI call needed: just orders available books by how often
// they've been borrowed.
export async function GET() {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const books = await prisma.book.findMany({
      where: { availableCopies: { gt: 0 } },
      include: { category: true, _count: { select: { issuedBooks: true } } },
      orderBy: [{ issuedBooks: { _count: "desc" } }, { addedAt: "desc" }],
      take: 6
    });

    return NextResponse.json(
      books.map(b => ({
        id: b.id,
        title: b.title,
        author: b.author,
        category: b.category?.name ?? null,
        available_copies: b.availableCopies,
        times_issued: b._count.issuedBooks
      }))
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not load popular books" }, { status: 500 });
  }
}
