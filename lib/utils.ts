import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Surface tokens for dark marketing sections — accents follow logo gold. */
export const DesignTokens = {
  bg: "#101014",
  surface: "#15161B",
  ink: "#EDEAE2",
  body: "#C9C6BA",
  muted: "#8A8779",
  mutedDark: "#5C5A50",
  hairline: "#2A2B31",
  gold: "#E9AE17",
  red: "#FF3131",
  purple: "#A431FF",
} as const;
