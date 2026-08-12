"use client";

import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { IssuedBooksTable } from "@/components/dashboard/IssuedBooksTable";
import { BooksOverviewChart } from "@/components/dashboard/BooksOverviewChart";
import { TopBooksChart } from "@/components/dashboard/TopBooksChart";
import { RecommendedBooks } from "@/components/dashboard/RecommendedBooks";
import { IconUsers, IconBookOut, IconBook, IconDollar } from "@/components/ui/icons";
import type { DashboardStats } from "@/types";

export default function DashboardPage() {
  const { data: stats, isLoading, isError } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: () => fetch("/api/dashboard/stats").then(r => r.json())
  });

  return (
    <div>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-0.5 text-[13.5px] text-slate-500">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="hidden text-[13px] text-slate-500 sm:block">Home &nbsp;›&nbsp; Dashboard</div>
      </div>

      <section className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading && <div className="empty-state col-span-full">Loading stats...</div>}
        {isError && <div className="empty-state col-span-full">Connect the database to see live stats.</div>}
        {stats && (
          <>
            <StatCard icon={IconUsers} title="Total Members" value={stats.totalMembers} delta={stats.membersDelta} />
            <StatCard icon={IconBookOut} title="Issued Books" value={stats.issuedBooks} delta={stats.issuedDelta} />
            <StatCard icon={IconBook} title="Total Books" value={stats.totalBooks} delta={stats.totalBooksDelta} />
            <StatCard icon={IconDollar} title="Total Fine" value={stats.totalFine} delta={stats.fineDelta} prefix="GH₵" />
          </>
        )}
      </section>

      <section className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-4">
        <BooksOverviewChart />
        <QuickActions />
        <ActivityFeed />
      </section>

      <section className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
        <IssuedBooksTable />
        <TopBooksChart />
      </section>

      <section className="mb-5">
        <RecommendedBooks />
      </section>

      <footer className="flex justify-between px-1 py-4 text-[12.5px] text-slate-500">
        <span>© 2026 University Library Management System. All rights reserved.</span>
        <span>Version 2.0.0</span>
      </footer>
    </div>
  );
}
