import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date into human-readable text
 * Examples:
 * - "Just now" (within 1 minute)
 * - "5 minutes ago"
 * - "2 hours ago"
 * - "Yesterday at 2:30 PM"
 * - "Oct 25, 2025 at 2:17 PM"
 *
 * @param {string | Date | number} date - The date to format
 * @returns {string} Human-readable date string
 */
export function formatDateToReadable(date) {
  if (!date) return "";

  const now = new Date();
  const targetDate = new Date(date);

  // Check if date is valid
  if (isNaN(targetDate.getTime())) {
    return "";
  }

  const diffInSeconds = Math.floor((now - targetDate) / 1000);

  // Just now (within 1 minute)
  if (diffInSeconds < 60) {
    return "Just now";
  }

  // Minutes ago
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  // Hours ago
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    targetDate.getDate() === yesterday.getDate() &&
    targetDate.getMonth() === yesterday.getMonth() &&
    targetDate.getFullYear() === yesterday.getFullYear()
  ) {
    const time = targetDate.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `Yesterday at ${time}`;
  }

  // Today
  if (
    targetDate.getDate() === now.getDate() &&
    targetDate.getMonth() === now.getMonth() &&
    targetDate.getFullYear() === now.getFullYear()
  ) {
    const time = targetDate.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `Today at ${time}`;
  }

  // Same year - show month, day, and time
  if (targetDate.getFullYear() === now.getFullYear()) {
    return targetDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Different year - show full date with time
  return targetDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
