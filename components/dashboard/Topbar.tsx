"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconMenu, IconSearch, IconBell } from "@/components/ui/icons";

export function Topbar({
  onMenuToggle,
  fullName
}: {
  onMenuToggle: () => void;
  fullName: string;
}) {
  const router = useRouter();
  const [term, setTerm] = useState("");

  const initials = fullName
    .split(" ")
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = term.trim();
    router.push(q ? `/books?q=${encodeURIComponent(q)}` : "/books");
  }

  return (
    <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-3.5">
      <button className="text-navy-900 md:hidden" onClick={onMenuToggle} aria-label="Toggle menu">
        <IconMenu />
      </button>

      <form
        onSubmit={handleSubmit}
        className="flex max-w-[420px] flex-1 items-center gap-2 rounded-[10px] border border-slate-200 bg-[var(--bg)] px-3 py-2.5 text-slate-500"
      >
        <IconSearch />
        <input
          type="text"
          placeholder="Search for books..."
          value={term}
          onChange={e => setTerm(e.target.value)}
          className="flex-1 border-none bg-transparent text-[13.5px] text-navy-900 outline-none placeholder:text-slate-400"
        />
      </form>

      <div className="ml-auto flex items-center gap-5">
        <button className="relative text-slate-500" aria-label="Notifications">
          <IconBell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 text-[13.5px] font-semibold">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange text-xs font-bold text-white">
            {initials || "U"}
          </div>
          <span>{fullName}</span>
        </div>
      </div>
    </header>
  );
}
