// components/ui/button.tsx — small shadcn-style primitive, hand-built to
// keep the app lightweight (no CLI-generated component bloat).
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary" && "bg-orange text-white hover:bg-orange-dark",
        variant === "outline" && "border border-slate-200 text-navy-900 hover:bg-slate-50",
        variant === "ghost" && "text-navy-900 hover:bg-slate-100",
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
