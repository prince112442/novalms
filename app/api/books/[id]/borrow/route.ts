import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/apiAuth";
import { getOrCreateMemberForProfile } from "@/lib/members";

const LOAN_DAYS = 14;

// POST /api/books/:id/borrow — self-service borrowing for any logged-in
// user (students, lecturers). Always borrows for the caller's own account
// — unlike the staff "Issue a Book" flow, there's no memberId to spoof.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { profile, unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const bookId = Number(id);

  try {
    const member = await getOrCreateMemberForProfile(profile!);

    if (member.status !== "ACTIVE") {
      return NextResponse.json({ message: "Your library account isn't active — see a librarian." }, { status: 403 });
    }

    const alreadyOut = await prisma.issuedBook.findFirst({
      where: { bookId, memberId: member.id, status: { in: ["ISSUED", "OVERDUE"] } }
    });
    if (alreadyOut) {
      return NextResponse.json({ message: "You already have this book out." }, { status: 400 });
    }

    const result = await prisma.$transaction(async tx => {
      const book = await tx.book.findUnique({ where: { id: bookId } });
      if (!book) throw new Error("NOT_FOUND");
      if (book.availableCopies < 1) throw new Error("NO_COPIES_AVAILABLE");

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + LOAN_DAYS);

      const loan = await tx.issuedBook.create({
        data: {
          bookId,
          memberId: member.id,
          issuedById: profile!.id,
          issueDate: new Date(),
          dueDate,
          status: "ISSUED"
        }
      });

      await tx.book.update({ where: { id: bookId }, data: { availableCopies: { decrement: 1 } } });
      await tx.activityLog.create({
        data: { actorName: member.fullName, action: `borrowed "${book.title}"`, entityType: "BOOK" }
      });

      return { loan, dueDate };
    });

    return NextResponse.json(
      { id: result.loan.id, dueDate: result.dueDate, message: "Book borrowed — enjoy!" },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Error && err.message === "NOT_FOUND") {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }
    if (err instanceof Error && err.message === "NO_COPIES_AVAILABLE") {
      return NextResponse.json({ message: "No copies available right now" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ message: "Could not borrow this book" }, { status: 500 });
  }
}
