"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export function DashboardShell({
  fullName,
  roleLabel,
  children
}: {
  fullName: string;
  roleLabel: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} fullName={fullName} roleLabel={roleLabel} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuToggle={() => setSidebarOpen(v => !v)} fullName={fullName} />
        <main className="mx-auto w-full max-w-[1400px] flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
