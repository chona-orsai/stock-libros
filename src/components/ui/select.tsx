import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ className, label, id, options, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-muted">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          "h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
