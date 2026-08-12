// components/ui/input.tsx
import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
