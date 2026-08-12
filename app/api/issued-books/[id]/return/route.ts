import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/apiAuth";

// PUT /api/issued-books/:id/return — marks a loan returned, restocks the book.
export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  try {
    await prisma.$transaction(async tx => {
      const loan = await tx.issuedBook.findUnique({ where: { id: Number(id) } });
      if (!loan) throw new Error("NOT_FOUND");
      if (loan.status === "RETURNED") throw new Error("ALREADY_RETURNED");

      await tx.issuedBook.update({
        where: { id: Number(id) },
        data: { status: "RETURNED", returnDate: new Date() }
      });
      await tx.book.update({ where: { id: loan.bookId }, data: { availableCopies: { increment: 1 } } });
      await tx.activityLog.create({ data: { actorName: "Staff", action: "processed a book return", entityType: "BOOK" } });
    });

    return NextResponse.json({ message: "Book returned" });
  } catch (err) {
    if (err instanceof Error && err.message === "NOT_FOUND") {
      return NextResponse.json({ message: "Loan record not found" }, { status: 404 });
    }
    if (err instanceof Error && err.message === "ALREADY_RETURNED") {
      return NextResponse.json({ message: "This book was already returned" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ message: "Could not process return" }, { status: 500 });
  }
}
