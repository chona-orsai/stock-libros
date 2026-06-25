import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ className, label, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-muted">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-ink placeholder:text-stone-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
          className,
        )}
        {...props}
      />
    </div>
  );
}
