import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-light shadow-sm border border-accent/20",
  secondary:
    "bg-paper-dark text-ink border border-stone-300 hover:bg-stone-200/60",
  ghost: "text-ink-muted hover:bg-stone-200/50 hover:text-ink",
  danger:
    "text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  icon: "h-8 w-8 rounded-md",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
