"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHead } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MemberRow {
  id: number;
  memberCode: string;
  fullName: string;
  email: string;
  memberType: string;
  status: string;
}

const MEMBER_TYPES = ["STUDENT", "LECTURER", "STAFF", "GUEST"];

export default function MembersPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ memberCode: "", fullName: "", email: "", memberType: "STUDENT" });

  const { data: members, isLoading, isError } = useQuery<MemberRow[]>({
    queryKey: ["members"],
    queryFn: () => fetch("/api/members").then(r => r.json())
  });

  const addMember = useMutation({
    mutationFn: (payload: typeof form) =>
      fetch("/api/members", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setForm({ memberCode: "", fullName: "", email: "", memberType: "STUDENT" });
    }
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Members</h1>
        <p className="mt-0.5 text-[13.5px] text-slate-500">Students, lecturers, and staff who can borrow books.</p>
      </div>

      <Card>
        <CardHead><h3 className="text-[15px] font-bold">Add a Member</h3></CardHead>
        <form
          onSubmit={e => { e.preventDefault(); addMember.mutate(form); }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-5"
        >
          <Input placeholder="Member ID" required value={form.memberCode} onChange={e => setForm({ ...form, memberCode: e.target.value })} />
          <Input placeholder="Full name" required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
          <Input type="email" placeholder="Email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <select
            value={form.memberType}
            onChange={e => setForm({ ...form, memberType: e.target.value })}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          >
            {MEMBER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <Button type="submit" disabled={addMember.isPending}>{addMember.isPending ? "Adding..." : "Add Member"}</Button>
        </form>
      </Card>

      <Card>
        <CardHead><h3 className="text-[15px] font-bold">All Members</h3></CardHead>
        <div className="-mx-[18px] overflow-x-auto px-[18px]">
          <table className="w-full min-w-[560px] border-collapse text-[13px]">
            <thead>
              <tr>
                {["ID", "Name", "Email", "Type", "Status"].map(h => (
                  <th key={h} className="border-b border-slate-200 px-1.5 py-2 text-left text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={5} className="empty-state">Loading...</td></tr>}
              {isError && <tr><td colSpan={5} className="empty-state">Could not load members.</td></tr>}
              {members?.length === 0 && <tr><td colSpan={5} className="empty-state">No members yet — add one above.</td></tr>}
              {members?.map(m => (
                <tr key={m.id}>
                  <td className="border-b border-slate-100 px-1.5 py-2.5">{m.memberCode}</td>
                  <td className="border-b border-slate-100 px-1.5 py-2.5 font-medium">{m.fullName}</td>
                  <td className="border-b border-slate-100 px-1.5 py-2.5 text-slate-500">{m.email}</td>
                  <td className="border-b border-slate-100 px-1.5 py-2.5 text-slate-500">{m.memberType}</td>
                  <td className="border-b border-slate-100 px-1.5 py-2.5 text-slate-500">{m.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
