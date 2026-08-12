"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  IconHome, IconBook, IconUsers, IconBookOut, IconDollar, IconPower, IconChat
} from "@/components/ui/icons";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: IconHome },
  { href: "/books", label: "Books", icon: IconBook },
  { href: "/members", label: "Members", icon: IconUsers },
  { href: "/issued-books", label: "Issued Books", icon: IconBookOut },
  { href: "/fines", label: "Fine Management", icon: IconDollar },
  { href: "/ai-librarian", label: "AI Librarian", icon: IconChat }
];

export function Sidebar({ open, fullName, roleLabel }: { open: boolean; fullName: string; roleLabel: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = fullName
    .split(" ")
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside
      className={`fixed z-50 flex h-screen w-[250px] flex-col bg-navy-900 p-3.5 text-[#c7cbe8] transition-[margin] duration-200 md:static md:z-auto ${
        open ? "ml-0" : "-ml-[250px] md:ml-0"
      }`}
    >
      <div className="flex items-center gap-2.5 px-2 pb-5 pt-1.5">
        <IconBook className="h-[22px] w-[22px] text-orange" />
        <div>
          <div className="text-[19px] font-bold leading-tight text-white">LMS</div>
          <div className="text-[11px] text-[#8b90bb]">University Library</div>
        </div>
      </div>

      <div className="mb-5 flex items-center gap-2.5 rounded-[10px] bg-white/5 p-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange text-[13px] font-bold text-white">
          {initials || "U"}
        </div>
        <div>
          <div className="text-[13px] font-semibold text-white">{fullName}</div>
          <div className="text-[11px] text-[#8b90bb]">{roleLabel}</div>
        </div>
      </div>

      <nav className="flex-1">
        <div className="mb-2 ml-2 text-[11px] uppercase tracking-wide text-[#5c6194]">Main Menu</div>
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-0.5 flex items-center gap-2.5 rounded-[9px] border-l-[3px] px-3 py-2.5 text-[13.5px] ${
                active
                  ? "border-orange bg-orange/[.16] font-semibold text-white"
                  : "border-transparent text-[#c7cbe8] hover:bg-white/[.06]"
              }`}
            >
              <Icon className={active ? "text-orange" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-3.5">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-[9px] bg-white/[.04] px-3 py-2.5 text-left text-[13.5px] text-rose-300 hover:bg-white/[.08]"
        >
          <IconPower />
          Log Out
        </button>
      </div>
    </aside>
  );
}
