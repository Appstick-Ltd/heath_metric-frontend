"use client";

import * as React from "react";
import { getAvatarUrl } from "@/lib/utils";

export interface UserAvatarProps {
  photoUrl?: string | null;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  shape?: "circle" | "rounded";
}

export function UserAvatar({
  photoUrl,
  name,
  size = "md",
  className = "",
  shape = "circle",
}: UserAvatarProps) {
  // Try proxy first (0), then direct CDN (1), then fallback initials (2)
  const [attempt, setAttempt] = React.useState<number>(0);
  const [loaded, setLoaded] = React.useState(false);
  const [prevPhotoUrl, setPrevPhotoUrl] = React.useState(photoUrl);

  // Reset attempt if photoUrl changes without effect
  if (photoUrl !== prevPhotoUrl) {
    setPrevPhotoUrl(photoUrl);
    setAttempt(0);
    setLoaded(false);
  }

  const sizeClasses = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-[11px]",
    md: "h-10 w-10 text-xs",
    lg: "h-12 w-12 text-sm",
    xl: "h-16 w-16 text-lg",
  }[size];

  const roundedClass = shape === "circle" ? "rounded-full" : "rounded-xl";

  const initials = (name || "U")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  const rawUrl = (photoUrl || "").trim();

  // Determine current image source based on retry attempt
  let currentSrc = "";
  if (rawUrl) {
    if (attempt === 0) {
      // 1. Try our server-side proxy route which strips referrers and caches
      currentSrc = getAvatarUrl(rawUrl);
    } else if (attempt === 1) {
      // 2. Direct URL fallback with no-referrer
      currentSrc = rawUrl;
    }
  }

  const handleImgError = () => {
    // If proxy failed, try direct URL; if direct failed, fall back to initials
    if (attempt === 0 && rawUrl && !rawUrl.startsWith("/")) {
      setAttempt(1);
    } else {
      setAttempt(2);
    }
  };

  const handleImgLoad = () => {
    setLoaded(true);
  };

  // Render photo if we haven't exhausted attempts
  if (rawUrl && attempt < 2 && currentSrc) {
    return (
      <div
        className={`relative ${sizeClasses} ${roundedClass} p-[1.5px] bg-gradient-to-tr from-teal-500 to-sky-500 shadow-sm shrink-0 overflow-hidden ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={currentSrc}
          src={currentSrc}
          alt={name || "User Avatar"}
          referrerPolicy="no-referrer"
          className={`h-full w-full ${roundedClass} object-cover bg-white dark:bg-slate-800 transition-opacity duration-200 ${
            loaded ? "opacity-100" : "opacity-80"
          }`}
          onLoad={handleImgLoad}
          onError={handleImgError}
        />
      </div>
    );
  }

  // Fallback to stylized initials badge
  return (
    <div
      className={`${sizeClasses} ${roundedClass} bg-gradient-to-tr from-emerald-100 to-teal-100 dark:from-emerald-950/70 dark:to-teal-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0 border border-emerald-500/20 shadow-xs ${className}`}
    >
      {initials}
    </div>
  );
}
