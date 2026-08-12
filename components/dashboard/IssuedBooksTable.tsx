"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHead } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IssuedBookRow } from "@/types";

export function IssuedBooksTable() {
  const { data, isLoading, isError } = useQuery<IssuedBookRow[]>({
    queryKey: ["issued-books-recent"],
    queryFn: () => fetch("/api/issued-books/recent").then(r => r.json())
  });

  return (
    <Card>
      <CardHead>
        <h3 className="text-[15px] font-bold">Recently Issued Books</h3>
        <a href="/issued-books" className="text-[13px] font-semibold text-orange-dark">View All</a>
      </CardHead>
      <div className="-mx-[18px] overflow-x-auto px-[18px]">
        <table className="w-full min-w-[520px] border-collapse text-[13px]">
          <thead>
            <tr>
              {["Book Title", "Member", "Issue Date", "Due Date", "Status"].map(h => (
                <th key={h} className="border-b border-slate-200 px-1.5 py-2 text-left text-xs font-semibold text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} className="empty-state">Loading...</td></tr>}
            {isError && <tr><td colSpan={5} className="empty-state">Could not load issued books.</td></tr>}
            {data?.length === 0 && <tr><td colSpan={5} className="empty-state">No books issued yet.</td></tr>}
            {data?.map((r, i) => (
              <tr key={i}>
                <td className="border-b border-slate-100 px-1.5 py-2.5">{r.title}</td>
                <td className="border-b border-slate-100 px-1.5 py-2.5">{r.member}</td>
                <td className="border-b border-slate-100 px-1.5 py-2.5">{r.issueDate}</td>
                <td className="border-b border-slate-100 px-1.5 py-2.5">{r.dueDate}</td>
                <td className="border-b border-slate-100 px-1.5 py-2.5">
                  <Badge tone={r.status.toLowerCase() as "issued" | "overdue" | "returned"}>{r.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
