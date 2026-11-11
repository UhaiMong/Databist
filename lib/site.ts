/**
 * Canonical public site origin used by sitemap, robots, and metadata.
 */
export function getSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "https://databist.com";

  return fromEnv.replace(/\/$/, "");
}

/** Digits-only phone for wa.me / tel links. */
export function toWhatsAppNumber(phone: string | null | undefined): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}
