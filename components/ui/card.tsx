// components/ui/card.tsx
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-card border border-slate-200 bg-white p-[18px] shadow-card", className)}
      {...props}
    />
  );
}

export function CardHead({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-3.5 flex items-center justify-between", className)} {...props} />;
}
