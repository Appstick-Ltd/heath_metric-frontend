import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount.replace(/[^0-9.-]+/g, "")) : amount;
  if (isNaN(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatTimeAgo(dateString: string | null | undefined): string {
  if (!dateString) return "Never";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Never";
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 0) return "Just now";
    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return formatDate(dateString);
  } catch {
    return "N/A";
  }
}

/**
 * Returns a safe URL for user avatars. If the URL points to Google's CDN or an external
 * provider that blocks localhost/domain referrers with HTTP 429/403, it routes through
 * our internal `/api/avatar?url=...` proxy.
 */
export function getAvatarUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || !url.trim()) return '';
  const clean = url.trim();
  if (clean.startsWith('/') || clean.startsWith('data:')) return clean;

  if (
    clean.includes('googleusercontent.com') ||
    clean.includes('google.com') ||
    clean.includes('ggpht.com')
  ) {
    return `/api/avatar?url=${encodeURIComponent(clean)}`;
  }
  return clean;
}

