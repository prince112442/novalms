"use client";

import { useQuery } from "@tanstack/react-query";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Card, CardHead } from "@/components/ui/card";
import type { TopBookSlice } from "@/types";

ChartJS.register(ArcElement, Tooltip);

export function TopBooksChart() {
  const { data, isLoading, isError } = useQuery<TopBookSlice[]>({
    queryKey: ["top-books"],
    queryFn: () => fetch("/api/dashboard/top-books").then(r => r.json())
  });

  const total = data?.reduce((sum, i) => sum + i.value, 0) ?? 0;

  return (
    <Card>
      <CardHead>
        <h3 className="text-[15px] font-bold">Top Books</h3>
        <a href="/books" className="text-[13px] font-semibold text-orange-dark">View All</a>
      </CardHead>

      {isLoading && <div className="empty-state">Loading...</div>}
      {isError && <div className="empty-state">Connect the database to see top books.</div>}
      {data?.length === 0 && <div className="empty-state">No book data yet.</div>}

      {data && data.length > 0 && (
        <div className="flex items-center gap-5">
          <div className="relative w-[140px] shrink-0">
            <Doughnut
              data={{
                labels: data.map(i => i.name),
                datasets: [{ data: data.map(i => i.value), backgroundColor: data.map(i => i.color), borderWidth: 0 }]
              }}
              options={{ cutout: "70%", plugins: { legend: { display: false } } }}
            />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-xl font-bold text-navy-900">{total.toLocaleString()}</div>
              <div className="text-xs text-slate-500">Total</div>
            </div>
          </div>
          <ul className="flex flex-1 flex-col gap-2.5 text-[13px]">
            {data.map(i => (
              <li key={i.name} className="flex items-center justify-between">
                <span className="flex items-center text-navy-900">
                  <span className="mr-2 inline-block h-[9px] w-[9px] rounded-full" style={{ background: i.color }} />
                  {i.name}
                </span>
                <span className="text-slate-500">{i.value} ({Math.round((i.value / total) * 100)}%)</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
