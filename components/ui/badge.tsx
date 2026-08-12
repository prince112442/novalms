// components/ui/badge.tsx
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "issued" | "overdue" | "returned" | "neutral";

const TONE_CLASSES: Record<Tone, string> = {
  issued: "bg-emerald-50 text-emerald-600",
  overdue: "bg-rose-50 text-rose-600",
  returned: "bg-orange-light text-orange-dark",
  neutral: "bg-slate-100 text-slate-600"
};

export function Badge({ tone = "neutral", className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn("rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold", TONE_CLASSES[tone], className)}
      {...props}
    />
  );
}
