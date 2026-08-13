"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHead } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BookRow {
  id: number;
  title: string;
  author: string;
  totalCopies: number;
  availableCopies: number;
  category: { name: string } | null;
}

export default function BooksClient({ canManage }: { canManage: boolean }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ title: "", author: "", totalCopies: 1 });

  const { data: books, isLoading, isError } = useQuery<BookRow[]>({
    queryKey: ["books"],
    queryFn: () => fetch("/api/books").then(r => r.json())
  });

  const addBook = useMutation({
    mutationFn: (payload: typeof form) =>
      fetch("/api/books", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setForm({ title: "", author: "", totalCopies: 1 });
    }
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Books</h1>
        <p className="mt-0.5 text-[13.5px] text-slate-500">Manage the library catalog.</p>
      </div>

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
        <CardHead><h3 className="text-[15px] font-bold">Catalog</h3></CardHead>
        <div className="-mx-[18px] overflow-x-auto px-[18px]">
          <table className="w-full min-w-[480px] border-collapse text-[13px]">
            <thead>
              <tr>
                {["Title", "Author", "Category", "Available / Total"].map(h => (
                  <th key={h} className="border-b border-slate-200 px-1.5 py-2 text-left text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={4} className="empty-state">Loading...</td></tr>}
              {isError && <tr><td colSpan={4} className="empty-state">Could not load the catalog.</td></tr>}
              {books?.length === 0 && <tr><td colSpan={4} className="empty-state">No books yet — add one above.</td></tr>}
              {books?.map(b => (
                <tr key={b.id}>
                  <td className="border-b border-slate-100 px-1.5 py-2.5 font-medium">{b.title}</td>
                  <td className="border-b border-slate-100 px-1.5 py-2.5 text-slate-500">{b.author}</td>
                  <td className="border-b border-slate-100 px-1.5 py-2.5 text-slate-500">{b.category?.name ?? "—"}</td>
                  <td className="border-b border-slate-100 px-1.5 py-2.5">{b.availableCopies} / {b.totalCopies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
