"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHead } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface FineRow {
  id: number;
  amount: number;
  reason: string;
  status: "UNPAID" | "PAID" | "WAIVED";
  member: { fullName: string };
}

export default function FinesPage() {
  const queryClient = useQueryClient();

  const { data: fines, isLoading, isError } = useQuery<FineRow[]>({
    queryKey: ["fines"],
    queryFn: () => fetch("/api/fines").then(r => r.json())
  });

  const markPaid = useMutation({
    mutationFn: (id: number) => fetch(`/api/fines/${id}/pay`, { method: "PUT" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fines"] })
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Fine Management</h1>
        <p className="mt-0.5 text-[13.5px] text-slate-500">Track and settle overdue fines.</p>
      </div>

      <Card>
        <CardHead><h3 className="text-[15px] font-bold">All Fines</h3></CardHead>
        <div className="-mx-[18px] overflow-x-auto px-[18px]">
          <table className="w-full min-w-[560px] border-collapse text-[13px]">
            <thead>
              <tr>
                {["Member", "Amount", "Reason", "Status", ""].map(h => (
                  <th key={h} className="border-b border-slate-200 px-1.5 py-2 text-left text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={5} className="empty-state">Loading...</td></tr>}
              {isError && <tr><td colSpan={5} className="empty-state">Could not load fines.</td></tr>}
              {fines?.length === 0 && <tr><td colSpan={5} className="empty-state">No fines on record.</td></tr>}
              {fines?.map(f => (
                <tr key={f.id}>
                  <td className="border-b border-slate-100 px-1.5 py-2.5 font-medium">{f.member.fullName}</td>
                  <td className="border-b border-slate-100 px-1.5 py-2.5">{formatCurrency(f.amount)}</td>
                  <td className="border-b border-slate-100 px-1.5 py-2.5 text-slate-500">{f.reason}</td>
                  <td className="border-b border-slate-100 px-1.5 py-2.5">
                    <Badge tone={f.status === "UNPAID" ? "overdue" : f.status === "PAID" ? "issued" : "neutral"}>{f.status}</Badge>
                  </td>
                  <td className="border-b border-slate-100 px-1.5 py-2.5">
                    {f.status === "UNPAID" && (
                      <Button variant="outline" onClick={() => markPaid.mutate(f.id)} disabled={markPaid.isPending}>
                        Mark Paid
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
