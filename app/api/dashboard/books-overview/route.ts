import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const range = req.nextUrl.searchParams.get("range");
  const days = range === "month" ? 30 : range === "year" ? 365 : 7;
  const since = new Date();
  since.setDate(since.getDate() - days);

  try {
    const [issuedGroups, returnedGroups] = await Promise.all([
      prisma.issuedBook.groupBy({
        by: ["issueDate"],
        where: { issueDate: { gte: since } },
        _count: { _all: true },
        orderBy: { issueDate: "asc" }
      }),
      prisma.issuedBook.groupBy({
        by: ["returnDate"],
        where: { returnDate: { gte: since } },
        _count: { _all: true },
        orderBy: { returnDate: "asc" }
      })
    ]);

    // Merge onto a single sorted set of day labels so both lines line up on the chart.
    const dayKey = (d: Date) => d.toISOString().slice(0, 10);
    const issuedMap = new Map(issuedGroups.map(g => [dayKey(g.issueDate), g._count._all]));
    const returnedMap = new Map(returnedGroups.map(g => [dayKey(g.returnDate as Date), g._count._all]));
    const labels = Array.from(new Set([...issuedMap.keys(), ...returnedMap.keys()])).sort();

    return NextResponse.json({
      labels,
      issued: labels.map(d => issuedMap.get(d) ?? 0),
      returned: labels.map(d => returnedMap.get(d) ?? 0)
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Could not load books overview" }, { status: 500 });
  }
}
