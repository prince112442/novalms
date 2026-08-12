"use client";

import { Card, CardHead } from "@/components/ui/card";
import { IconBookPlus, IconUserPlus, IconArrowUpCircle, IconArrowDownCircle, IconTrending } from "@/components/ui/icons";

const ACTIONS = [
  { label: "Add Book", icon: IconBookPlus, href: "/books" },
  { label: "Add Member", icon: IconUserPlus, href: "/members" },
  { label: "Issue Book", icon: IconArrowUpCircle, href: "/issued-books" },
  { label: "Return Book", icon: IconArrowDownCircle, href: "/issued-books" },
  { label: "AI Librarian", icon: IconTrending, href: "/ai-librarian", wide: true }
];

export function QuickActions() {
  return (
    <Card>
      <CardHead>
        <h3 className="text-[15px] font-bold">Quick Actions</h3>
      </CardHead>
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map(a => (
          <a
            key={a.label}
            href={a.href}
            className={`flex flex-col items-start gap-2 rounded-xl border border-slate-200 p-3.5 text-[13px] font-semibold hover:bg-[var(--bg)] ${
              a.wide ? "col-span-2 flex-row items-center" : ""
            }`}
          >
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-navy-900 text-orange">
              <a.icon />
            </span>
            {a.label}
          </a>
        ))}
      </div>
    </Card>
  );
}
