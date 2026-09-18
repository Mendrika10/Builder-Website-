import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  trailing?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, trailing, id: idProp, ...props }, ref) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="mb-1.5 block text-small font-medium text-neutral-800">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={cn(
              "h-10 w-full rounded-input border bg-surface-card px-3 text-body text-neutral-800",
              "placeholder:text-neutral-400",
              "transition-colors duration-fast ease-standard",
              "focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-1",
              "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-neutral-500",
              "read-only:bg-surface-sunken",
              error ? "border-danger" : "border-neutral-200",
              trailing && "pr-10",
              className,
            )}
            {...props}
          />
          {trailing && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400">
              {trailing}
            </div>
          )}
        </div>
        {error && (
          <p id={`${id}-error`} role="alert" className="mt-1.5 text-small text-danger">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-small text-neutral-500">
            {hint}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
