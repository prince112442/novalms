"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend
} from "chart.js";
import { Card, CardHead } from "@/components/ui/card";
import type { BooksOverview } from "@/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RANGE_OPTIONS = [
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" }
];

export function BooksOverviewChart() {
  const [range, setRange] = useState("week");
  const { data, isLoading, isError } = useQuery<BooksOverview>({
    queryKey: ["books-overview", range],
    queryFn: () => fetch(`/api/dashboard/books-overview?range=${range}`).then(r => r.json())
  });

  return (
    <Card className="lg:col-span-2">
      <CardHead>
        <h3 className="text-[15px] font-bold">Books Overview</h3>
        <select
          value={range}
          onChange={e => setRange(e.target.value)}
          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[13px] text-slate-500"
        >
          {RANGE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </CardHead>

      {isLoading && <div className="empty-state">Loading...</div>}
      {isError && <div className="empty-state">Connect the database to see the books overview chart.</div>}
      {data && (
        <Line
          data={{
            labels: data.labels,
            datasets: [
              {
                label: "Issued Books",
                data: data.issued,
                borderColor: "#e2833f",
                backgroundColor: "rgba(226,131,63,0.12)",
                tension: 0.4,
                fill: true,
                pointRadius: 3
              },
              {
                label: "Returned Books",
                data: data.returned,
                borderColor: "#262b5c",
                backgroundColor: "rgba(38,43,92,0.10)",
                tension: 0.4,
                fill: true,
                pointRadius: 3
              }
            ]
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: "top", align: "start", labels: { boxWidth: 8, usePointStyle: true } } },
            scales: { y: { beginAtZero: true, grid: { color: "#eef1f4" } }, x: { grid: { display: false } } }
          }}
        />
      )}
    </Card>
  );
}
