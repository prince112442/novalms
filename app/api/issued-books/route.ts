import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const status = req.nextUrl.searchParams.get("status");
  try {
    const rows = await prisma.issuedBook.findMany({
      where: status ? { status: status.toUpperCase() as "ISSUED" | "RETURNED" | "OVERDUE" } : undefined,
      include: { book: true, member: true },
      orderBy: { issueDate: "desc" }
    });
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not load issued books" }, { status: 500 });
  }
}

// POST /api/issued-books  { bookId, memberId, dueDate }
// Issues a book: creates the loan row and decrements available_copies, inside a transaction.
export async function POST(req: NextRequest) {
  // Manual desk issuing (any member, any book) is staff-only — students
  // borrow for themselves through POST /api/books/:id/borrow instead.
  const { unauthorized, user } = await requireRole(["SUPER_ADMIN", "LIBRARIAN"]);
  if (unauthorized) return unauthorized;

  const { bookId, memberId, dueDate } = await req.json();
  if (!bookId || !memberId || !dueDate) {
    return NextResponse.json({ message: "bookId, memberId and dueDate are required" }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async tx => {
      const book = await tx.book.findUnique({ where: { id: Number(bookId) } });
      if (!book || book.availableCopies < 1) {
        throw new Error("NO_COPIES_AVAILABLE");
      }

      const loan = await tx.issuedBook.create({
        data: {
          bookId: Number(bookId),
          memberId: Number(memberId),
          issuedById: user?.id ?? null,
          issueDate: new Date(),
          dueDate: new Date(dueDate),
          status: "ISSUED"
        }
      });

      await tx.book.update({ where: { id: Number(bookId) }, data: { availableCopies: { decrement: 1 } } });
      await tx.activityLog.create({
        data: { actorName: "Staff", action: `issued "${book.title}"`, entityType: "BOOK" }
      });

      return loan;
    });

    return NextResponse.json({ id: result.id, message: "Book issued" }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "NO_COPIES_AVAILABLE") {
      return NextResponse.json({ message: "No copies available for this book" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ message: "Could not issue book" }, { status: 500 });
  }
}
