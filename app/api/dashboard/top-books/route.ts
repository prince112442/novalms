import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/apiAuth";

const COLORS = ["#e2833f", "#1b1f45", "#c96f2e", "#363c78", "#f0a868"];

export async function GET() {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const groups = await prisma.book.groupBy({
      by: ["categoryId"],
      _sum: { totalCopies: true },
      orderBy: { _sum: { totalCopies: "desc" } },
      take: 5
    });

    const categoryIds = groups.map(g => g.categoryId).filter((id): id is number => id !== null);
    const categories = await prisma.category.findMany({ where: { id: { in: categoryIds } } });

    const result = groups.map((g, i) => ({
      name: categories.find(c => c.id === g.categoryId)?.name ?? "Uncategorized",
      value: g._sum.totalCopies ?? 0,
      color: COLORS[i % COLORS.length]
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not load top books" }, { status: 500 });
  }
}
