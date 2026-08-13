"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHead } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconSearch } from "@/components/ui/icons";

interface BookRow {
  id: number;
  title: string;
  author: string;
  totalCopies: number;
  availableCopies: number;
  category: { name: string } | null;
}

interface MyLoanRow {
  id: number;
  status: "ISSUED" | "RETURNED" | "OVERDUE";
  dueDate: string;
  book: { id: number; title: string };
}

export default function BooksClient({ canManage, initialQuery }: { canManage: boolean; initialQuery: string }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ title: "", author: "", totalCopies: 1 });
  const [query, setQuery] = useState(initialQuery);
  const [borrowError, setBorrowError] = useState<string | null>(null);

  const { data: books, isLoading, isError } = useQuery<BookRow[]>({
    queryKey: ["books"],
    queryFn: () => fetch("/api/books").then(r => r.json())
  });

  // Only students/lecturers self-borrow — managers already have the full
  // "Issue a Book" desk flow on the Issued Books page.
  const { data: myLoans } = useQuery<MyLoanRow[]>({
    queryKey: ["my-loans"],
    queryFn: () => fetch("/api/issued-books/mine").then(r => r.json()),
    enabled: !canManage
  });

  const addBook = useMutation({
    mutationFn: (payload: typeof form) =>
      fetch("/api/books", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setForm({ title: "", author: "", totalCopies: 1 });
    }
  });

  const borrowBook = useMutation({
    mutationFn: async (bookId: number) => {
      const res = await fetch(`/api/books/${bookId}/borrow`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message ?? "Could not borrow this book");
      return data;
    },
    onSuccess: () => {
      setBorrowError(null);
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["my-loans"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
    },
    onError: (err: Error) => setBorrowError(err.message)
  });

  const activeLoanBookIds = useMemo(
    () => new Set((myLoans ?? []).filter(l => l.status !== "RETURNED").map(l => l.book.id)),
    [myLoans]
  );

  const filteredBooks = useMemo(() => {
    if (!books) return books;
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter(
      b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.category?.name ?? "").toLowerCase().includes(q)
    );
  }, [books, query]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Books</h1>
        <p className="mt-0.5 text-[13.5px] text-slate-500">
          {canManage ? "Manage the library catalog." : "Browse the catalog and borrow what you need."}
        </p>
      </div>

      {!canManage && myLoans && myLoans.filter(l => l.status !== "RETURNED").length > 0 && (
        <Card>
          <CardHead><h3 className="text-[15px] font-bold">My Borrowed Books</h3></CardHead>
          <ul className="divide-y divide-slate-100">
            {myLoans.filter(l => l.status !== "RETURNED").map(l => (
              <li key={l.id} className="flex items-center justify-between py-2.5 text-[13px]">
                <span className="font-medium">{l.book.title}</span>
                <span className="flex items-center gap-2.5">
                  <span className="text-[11.5px] text-slate-500">Due {l.dueDate.slice(0, 10)}</span>
                  <Badge tone={l.status.toLowerCase() as "issued" | "overdue"}>{l.status}</Badge>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {canManage && (
        <Card>
          <CardHead><h3 className="text-[15px] font-bold">Add a Book</h3></CardHead>
          <form
            onSubmit={e => { e.preventDefault(); addBook.mutate(form); }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-4"
          >
            <Input placeholder="Title" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <Input placeholder="Author" required value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
            <Input
              type="number" min={1} placeholder="Copies"
              value={form.totalCopies}
              onChange={e => setForm({ ...form, totalCopies: Number(e.target.value) })}
            />
            <Button type="submit" disabled={addBook.isPending}>{addBook.isPending ? "Adding..." : "Add Book"}</Button>
          </form>
        </Card>
      )}

      <Card>
        <CardHead>
          <h3 className="text-[15px] font-bold">Catalog</h3>
          <div className="flex w-full max-w-[280px] items-center gap-2 rounded-[10px] border border-slate-200 bg-[var(--bg)] px-3 py-2 text-slate-500">
            <IconSearch className="h-4 w-4 shrink-0" />
            <input
              type="text"
              placeholder="Search title, author, category..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full border-none bg-transparent text-[13px] text-navy-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </CardHead>

        {borrowError && (
          <p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] text-rose-600">{borrowError}</p>
        )}

        <div className="-mx-[18px] overflow-x-auto px-[18px]">
          <table className="w-full min-w-[560px] border-collapse text-[13px]">
            <thead>
              <tr>
                {["Title", "Author", "Category", "Available / Total", ...(canManage ? [] : [""])].map(h => (
                  <th key={h} className="border-b border-slate-200 px-1.5 py-2 text-left text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={5} className="empty-state">Loading...</td></tr>}
              {isError && <tr><td colSpan={5} className="empty-state">Could not load the catalog.</td></tr>}
              {filteredBooks?.length === 0 && (
                <tr><td colSpan={5} className="empty-state">{query ? "No books match your search." : "No books yet — add one above."}</td></tr>
              )}
              {filteredBooks?.map(b => (
                <tr key={b.id}>
                  <td className="border-b border-slate-100 px-1.5 py-2.5 font-medium">{b.title}</td>
                  <td className="border-b border-slate-100 px-1.5 py-2.5 text-slate-500">{b.author}</td>
                  <td className="border-b border-slate-100 px-1.5 py-2.5 text-slate-500">{b.category?.name ?? "—"}</td>
                  <td className="border-b border-slate-100 px-1.5 py-2.5">{b.availableCopies} / {b.totalCopies}</td>
                  {!canManage && (
                    <td className="border-b border-slate-100 px-1.5 py-2.5">
                      {activeLoanBookIds.has(b.id) ? (
                        <Badge tone="issued">Borrowed</Badge>
                      ) : (
                        <Button
                          variant="outline"
                          disabled={b.availableCopies < 1 || borrowBook.isPending}
                          onClick={() => borrowBook.mutate(b.id)}
                        >
                          {b.availableCopies < 1 ? "Unavailable" : borrowBook.isPending ? "Borrowing..." : "Borrow"}
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
