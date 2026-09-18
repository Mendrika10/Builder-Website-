import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "flat" | "bordered" | "elevated";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  flat: "bg-surface-card",
  bordered: "bg-surface-card border border-neutral-200",
  elevated: "bg-surface-card shadow-raised",
};

export function Card({ className, variant = "bordered", ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-card p-6", variantClasses[variant], className)}
      {...props}
    />
  );
}
