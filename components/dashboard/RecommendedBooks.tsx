"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHead } from "@/components/ui/card";
import type { RecommendedBook } from "@/types";

export function RecommendedBooks() {
  const { data, isLoading, isError } = useQuery<RecommendedBook[]>({
    queryKey: ["recommendations-popular"],
    queryFn: () => fetch("/api/recommendations/popular").then(r => r.json())
  });

  return (
    <Card>
      <CardHead>
        <h3 className="text-[15px] font-bold">Recommended for Lending</h3>
        <span className="text-[13px] font-semibold text-orange-dark">Based on borrowing trends</span>
      </CardHead>

      {isLoading && <div className="empty-state">Loading...</div>}
      {isError && <div className="empty-state">Connect the database to see recommendations.</div>}
      {data?.length === 0 && <div className="empty-state">No recommendations yet — issue a few books first.</div>}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map(b => (
            <div key={b.id} className="flex flex-col gap-1.5 rounded-xl border border-slate-200 p-3.5">
              <div className="text-[13.5px] font-bold leading-tight">{b.title}</div>
              <div className="text-xs text-slate-500">{b.author}</div>
              <div className="mt-1 flex items-center justify-between">
                <span className="rounded-full bg-orange-light px-2 py-0.5 text-[11px] font-semibold text-orange-dark">
                  {b.category ?? "General"}
                </span>
                <span className="text-[11.5px] text-slate-500">{b.available_copies} available</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
