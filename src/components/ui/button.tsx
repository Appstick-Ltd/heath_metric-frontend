import * as React from "react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./loader";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  loadingText?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const variants = {
      primary:
        "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow active:scale-[0.98]",
      secondary:
        "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98]",
      outline:
        "border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 active:scale-[0.98]",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white shadow-sm active:scale-[0.98]",
      ghost:
        "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
      link: "text-emerald-600 hover:underline p-0 h-auto",
    };

    const sizes = {
      sm: "text-xs px-3 h-8 gap-1.5",
      md: "text-sm px-4 h-10 gap-2",
      lg: "text-base px-6 h-12 gap-2.5",
      icon: "h-10 w-10 p-0",
    };

    const spinnerVariant =
      variant === "primary" || variant === "danger" ? "white" : "primary";
    const spinnerSize = size === "sm" ? "xs" : size === "lg" ? "md" : "sm";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isLoading && "cursor-wait opacity-80",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size={spinnerSize} variant={spinnerVariant} />
            <span>{loadingText || children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";
