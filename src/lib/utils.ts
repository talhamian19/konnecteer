import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, differenceInSeconds } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMatchTime(date: Date): string {
  return format(new Date(date), "EEE, MMM d · h:mm a");
}

export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getCountdown(kickoffTime: Date): {
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
  isPast: boolean;
} {
  const now = new Date();
  const target = new Date(kickoffTime);
  const diff = differenceInSeconds(target, now);

  if (diff < 0 && diff > -7200) {
    return { hours: 0, minutes: 0, seconds: 0, isLive: true, isPast: false };
  }
  if (diff <= -7200) {
    return { hours: 0, minutes: 0, seconds: 0, isLive: false, isPast: true };
  }

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;
  return { hours, minutes, seconds, isLive: false, isPast: false };
}

export function getVibeColor(vibe: string): string {
  const colors: Record<string, string> = {
    HARDCORE: "from-red-600 to-red-800",
    CASUAL: "from-blue-500 to-blue-700",
    PARTY: "from-purple-500 to-pink-600",
    FAMILY: "from-green-500 to-emerald-700",
    CHILL: "from-sky-400 to-cyan-600",
    INTERNATIONAL: "from-amber-500 to-orange-600",
  };
  return colors[vibe] ?? "from-gray-500 to-gray-700";
}

export function getVibeBadgeColor(vibe: string): string {
  const colors: Record<string, string> = {
    HARDCORE: "bg-red-500/20 text-red-400 border-red-500/30",
    CASUAL: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    PARTY: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    FAMILY: "bg-green-500/20 text-green-400 border-green-500/30",
    CHILL: "bg-sky-500/20 text-sky-400 border-sky-500/30",
    INTERNATIONAL: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  };
  return colors[vibe] ?? "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

export function getSafetyColor(level: string): string {
  const colors: Record<string, string> = {
    SAFE: "text-green-400",
    MODERATE: "text-yellow-400",
    CAUTION: "text-red-400",
  };
  return colors[level] ?? "text-gray-400";
}

export function getPopularityBar(score: number): number {
  return Math.min(100, (score / 10) * 100);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "…";
}

export function formatAttendees(current: number, max: number | null): string {
  if (!max) return `${current} attending`;
  const pct = Math.round((current / max) * 100);
  return `${current}/${max} (${pct}% full)`;
}

export function getStatusBadge(status: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    UPCOMING: { label: "Upcoming", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    LIVE: { label: "🔴 LIVE", color: "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse" },
    FINISHED: { label: "Finished", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
    POSTPONED: { label: "Postponed", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  };
  return map[status] ?? { label: status, color: "bg-gray-500/20 text-gray-400 border-gray-500/30" };
}
