import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/apiAuth";

export async function GET() {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const books = await prisma.book.findMany({
      include: { category: true },
      orderBy: { addedAt: "desc" }
    });
    return NextResponse.json(books);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not load books" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const { isbn, title, author, categoryId, totalCopies, shelfLocation, coverUrl } = body;

  if (!title || !author) {
    return NextResponse.json({ message: "Title and author are required" }, { status: 400 });
  }

  try {
    const book = await prisma.book.create({
      data: {
        isbn: isbn || null,
        title,
        author,
        categoryId: categoryId || null,
        totalCopies: totalCopies || 1,
        availableCopies: totalCopies || 1,
        shelfLocation: shelfLocation || null,
        coverUrl: coverUrl || null
      }
    });
    return NextResponse.json({ id: book.id, message: "Book added" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not add book" }, { status: 500 });
  }
}
