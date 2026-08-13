"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHead } from "@/components/ui/card";
import type { RecommendedBook } from "@/types";

interface MemberMe {
  id: number;
}

interface PersonalizedResponse {
  basis: "borrowing history" | "popularity";
  books: RecommendedBook[];
}

export function RecommendedBooks() {
  // Figure out the logged-in user's own member record first, so the
  // recommendations can be based on their borrowing history once they
  // have some — new accounts just fall back to library-wide popularity.
  const { data: me } = useQuery<MemberMe>({
    queryKey: ["members-me"],
    queryFn: () => fetch("/api/members/me").then(r => r.json())
  });

  const { data, isLoading, isError } = useQuery<PersonalizedResponse>({
    queryKey: ["recommendations-member", me?.id],
    queryFn: () => fetch(`/api/recommendations/member/${me!.id}`).then(r => r.json()),
    enabled: !!me?.id
  });

  const books = data?.books;
  const personalized = data?.basis === "borrowing history";

  return (
    <Card>
      <CardHead>
        <h3 className="text-[15px] font-bold">{personalized ? "Recommended for You" : "Recommended for Lending"}</h3>
        <span className="text-[13px] font-semibold text-orange-dark">
          {personalized ? "Based on what you've borrowed" : "Based on borrowing trends"}
        </span>
      </CardHead>

      {(isLoading || !me) && <div className="empty-state">Loading...</div>}
      {isError && <div className="empty-state">Connect the database to see recommendations.</div>}
      {books?.length === 0 && <div className="empty-state">No recommendations yet — borrow a few books first.</div>}

      {books && books.length > 0 && (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {books.map(b => (
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
