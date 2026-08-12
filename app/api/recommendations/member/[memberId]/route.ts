import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/apiAuth";

// GET /api/recommendations/member/:memberId
// Personalized: tallies the categories a member has borrowed from, picks
// their top one, and suggests available books there they don't already
// have out. New members (no history) fall back to library-wide popularity.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ memberId: string }> }) {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const { memberId } = await params;
  const memberIdNum = Number(memberId);

  try {
    const loans = await prisma.issuedBook.findMany({
      where: { memberId: memberIdNum },
      select: { bookId: true, book: { select: { categoryId: true } } }
    });

    const alreadyBorrowedIds = loans.map(l => l.bookId);
    const tally = new Map<number, number>();
    for (const l of loans) {
      if (l.book.categoryId) tally.set(l.book.categoryId, (tally.get(l.book.categoryId) ?? 0) + 1);
    }
    const topCategoryId = [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

    if (topCategoryId) {
      const books = await prisma.book.findMany({
        where: {
          categoryId: topCategoryId,
          availableCopies: { gt: 0 },
          id: { notIn: alreadyBorrowedIds }
        },
        include: { category: true },
        orderBy: { availableCopies: "desc" },
        take: 6
      });

      if (books.length) {
        return NextResponse.json({
          basis: "borrowing history",
          books: books.map(b => ({
            id: b.id, title: b.title, author: b.author,
            category: b.category?.name ?? null, available_copies: b.availableCopies
          }))
        });
      }
    }

    // Fallback: no history yet, or nothing left in their favorite category
    const popular = await prisma.book.findMany({
      where: { availableCopies: { gt: 0 }, id: { notIn: alreadyBorrowedIds } },
      include: { category: true, _count: { select: { issuedBooks: true } } },
      orderBy: [{ issuedBooks: { _count: "desc" } }, { addedAt: "desc" }],
      take: 6
    });

    return NextResponse.json({
      basis: "popularity",
      books: popular.map(b => ({
        id: b.id, title: b.title, author: b.author,
        category: b.category?.name ?? null, available_copies: b.availableCopies,
        times_issued: b._count.issuedBooks
      }))
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not load recommendations" }, { status: 500 });
  }
}
