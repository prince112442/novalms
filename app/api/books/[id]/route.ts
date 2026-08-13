import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/apiAuth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  try {
    const book = await prisma.book.findUnique({ where: { id: Number(id) }, include: { category: true } });
    if (!book) return NextResponse.json({ message: "Book not found" }, { status: 404 });
    return NextResponse.json(book);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not load book" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Only librarians/admins can edit books — students and lecturers are read-only here.
  const { unauthorized } = await requireRole(["SUPER_ADMIN", "LIBRARIAN"]);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await req.json();
  const { title, author, categoryId, totalCopies, shelfLocation, coverUrl } = body;

  try {
    await prisma.book.update({
      where: { id: Number(id) },
      data: { title, author, categoryId, totalCopies, shelfLocation, coverUrl }
    });
    return NextResponse.json({ message: "Book updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not update book" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Only librarians/admins can delete books — students and lecturers are read-only here.
  const { unauthorized } = await requireRole(["SUPER_ADMIN", "LIBRARIAN"]);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  try {
    await prisma.book.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Book deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not delete book" }, { status: 500 });
  }
}
