import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine class names with Tailwind conflict resolution.
 *
 * Usage:
 * cn("p-2", isActive && "bg-red-500", "p-4")
 * -> "bg-red-500 p-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
