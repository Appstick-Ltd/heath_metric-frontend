import * as React from "react";
import { HeartPulse, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "white" | "muted" | "secondary";
}

const spinnerSizes = {
  xs: "h-3.5 w-3.5",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

const spinnerVariants = {
  primary: "text-emerald-600 dark:text-emerald-400",
  white: "text-white",
  muted: "text-slate-400 dark:text-slate-500",
  secondary: "text-sky-500",
};

export function LoadingSpinner({
  size = "md",
  variant = "primary",
  className,
  ...props
}: SpinnerProps) {
  return (
    <Loader2
      className={cn(
        "animate-spin",
        spinnerSizes[size],
        spinnerVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export interface HeartbeatLoaderProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  subMessage?: string;
  className?: string;
}

export function HeartbeatLoader({
  size = "md",
  message = "Loading health records...",
  subMessage,
  className,
}: HeartbeatLoaderProps) {
  const containerSizes = {
    sm: "h-10 w-10",
    md: "h-14 w-14",
    lg: "h-20 w-20",
  };

  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-10 w-10",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-6", className)}>
      <div className="relative flex items-center justify-center">
        {/* Concentric expanding radar pulse rings */}
        <div
          className={cn(
            "absolute rounded-full bg-emerald-500/20 dark:bg-emerald-500/15 animate-ping duration-1000",
            containerSizes[size]
          )}
        />
        <div
          className={cn(
            "absolute rounded-full bg-teal-400/25 dark:bg-teal-400/15 animate-pulse",
            containerSizes[size],
            "scale-125"
          )}
        />

        {/* Center glowing squircle badge with heartbeat icon */}
        <div
          className={cn(
            "relative rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 transition-transform duration-300 animate-pulse",
            containerSizes[size]
          )}
        >
          <HeartPulse className={cn(iconSizes[size], "animate-bounce duration-700")} />
        </div>
      </div>

      {message && (
        <h4 className="mt-5 text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">
          {message}
        </h4>
      )}

      {subMessage && (
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 max-w-xs font-normal">
          {subMessage}
        </p>
      )}
    </div>
  );
}

export interface PageLoaderProps {
  message?: string;
  subMessage?: string;
  minHeight?: string;
}

export function PageLoader({
  message = "Connecting to clinical database...",
  subMessage = "Syncing health metrics & patient data",
  minHeight = "min-h-[50vh]",
}: PageLoaderProps) {
  return (
    <div className={cn("flex items-center justify-center w-full", minHeight)}>
      <HeartbeatLoader message={message} subMessage={subMessage} size="md" />
    </div>
  );
}

export interface LoadingOverlayProps {
  isOpen: boolean;
  message?: string;
  subMessage?: string;
}

export function LoadingOverlay({
  isOpen,
  message = "Processing request...",
  subMessage = "Please wait a moment while changes are applied",
}: LoadingOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col items-center max-w-sm mx-4">
        <HeartbeatLoader
          size="md"
          message={message}
          subMessage={subMessage}
          className="p-0"
        />
      </div>
    </div>
  );
}
