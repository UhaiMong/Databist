import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Fraunces, IBM_Plex_Mono } from "next/font/google";

// Clsx
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Font
export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

// Design token

export const DesignTokens = {
  bg: "#101014",
  surface: "#15161B",
  ink: "#EDEAE2",
  body: "#C9C6BA",
  muted: "#8A8779",
  mutedDark: "#5C5A50",
  hairline: "#2A2B31",
  gold: "#C9A15A",
} as const;
