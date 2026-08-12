"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHead } from "@/components/ui/card";
import { IconCheck } from "@/components/ui/icons";
import type { ActivityItem } from "@/types";

export function ActivityFeed() {
  const { data, isLoading, isError } = useQuery<ActivityItem[]>({
    queryKey: ["activity"],
    queryFn: () => fetch("/api/dashboard/activity").then(r => r.json())
  });

  return (
    <Card>
      <CardHead>
        <h3 className="text-[15px] font-bold">Recent Activity</h3>
      </CardHead>
      <ul>
        {isLoading && <li className="empty-state">Loading...</li>}
        {isError && <li className="empty-state">Could not load recent activity.</li>}
        {data?.length === 0 && <li className="empty-state">No recent activity yet.</li>}
        {data?.map((a, i) => (
          <li key={i} className="flex items-center gap-2.5 border-b border-slate-100 py-2.5 text-[13px] last:border-none">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-light text-orange-dark">
              <IconCheck className="h-[15px] w-[15px]" />
            </span>
            <span className="flex-1">{a.text}</span>
            <span className="whitespace-nowrap text-[11.5px] text-slate-500">{a.time}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
