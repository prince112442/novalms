"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHead } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LoanRow {
  id: number;
  status: "ISSUED" | "RETURNED" | "OVERDUE";
  issueDate: string;
  dueDate: string;
  book: { title: string };
  member: { fullName: string };
}

export default function IssuedBooksPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ bookId: "", memberId: "", dueDate: "" });

  const { data: loans, isLoading, isError } = useQuery<LoanRow[]>({
    queryKey: ["issued-books"],
    queryFn: () => fetch("/api/issued-books").then(r => r.json())
  });

  const issueBook = useMutation({
    mutationFn: (payload: typeof form) =>
      fetch("/api/issued-books", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issued-books"] });
      setForm({ bookId: "", memberId: "", dueDate: "" });
    }
  });

  const returnBook = useMutation({
    mutationFn: (id: number) => fetch(`/api/issued-books/${id}/return`, { method: "PUT" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["issued-books"] })
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Issued Books</h1>
        <p className="mt-0.5 text-[13.5px] text-slate-500">Issue a book to a member, or process a return.</p>
      </div>

      <Card>
        <CardHead><h3 className="text-[15px] font-bold">Issue a Book</h3></CardHead>
        <form
          onSubmit={e => { e.preventDefault(); issueBook.mutate(form); }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-4"
        >
          <Input placeholder="Book ID" required value={form.bookId} onChange={e => setForm({ ...form, bookId: e.target.value })} />
          <Input placeholder="Member ID" required value={form.memberId} onChange={e => setForm({ ...form, memberId: e.target.value })} />
          <Input type="date" required value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
          <Button type="submit" disabled={issueBook.isPending}>{issueBook.isPending ? "Issuing..." : "Issue Book"}</Button>
        </form>
        {issueBook.isError && <p className="mt-2 text-[12.5px] text-rose-600">Could not issue that book — check the ID and available copies.</p>}
      </Card>

      <Card>
        <CardHead><h3 className="text-[15px] font-bold">All Loans</h3></CardHead>
        <div className="-mx-[18px] overflow-x-auto px-[18px]">
          <table className="w-full min-w-[620px] border-collapse text-[13px]">
            <thead>
              <tr>
                {["Book", "Member", "Issued", "Due", "Status", ""].map(h => (
                  <th key={h} className="border-b border-slate-200 px-1.5 py-2 text-left text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={6} className="empty-state">Loading...</td></tr>}
              {isError && <tr><td colSpan={6} className="empty-state">Could not load loans.</td></tr>}
              {loans?.length === 0 && <tr><td colSpan={6} className="empty-state">No loans yet.</td></tr>}
              {loans?.map(l => (
                <tr key={l.id}>
                  <td className="border-b border-slate-100 px-1.5 py-2.5 font-medium">{l.book.title}</td>
                  <td className="border-b border-slate-100 px-1.5 py-2.5">{l.member.fullName}</td>
                  <td className="border-b border-slate-100 px-1.5 py-2.5 text-slate-500">{l.issueDate.slice(0, 10)}</td>
                  <td className="border-b border-slate-100 px-1.5 py-2.5 text-slate-500">{l.dueDate.slice(0, 10)}</td>
                  <td className="border-b border-slate-100 px-1.5 py-2.5">
                    <Badge tone={l.status.toLowerCase() as "issued" | "overdue" | "returned"}>{l.status}</Badge>
                  </td>
                  <td className="border-b border-slate-100 px-1.5 py-2.5">
                    {l.status !== "RETURNED" && (
                      <Button variant="outline" onClick={() => returnBook.mutate(l.id)} disabled={returnBook.isPending}>
                        Return
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
