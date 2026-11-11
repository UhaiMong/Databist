import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

const SITE_NAME = "Databist";
const DEFAULT_DESCRIPTION =
  "Full-service digital marketing and web development agency serving Bangladesh, the UAE, and beyond. Book a free consultation today.";
const DEFAULT_OG_IMAGE = "/logo.png";

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function absoluteImageUrl(
  src: string | null | undefined,
  fallback = DEFAULT_OG_IMAGE,
): string {
  const value = src || fallback;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return absoluteUrl(value.startsWith("/") ? value : `/${value}`);
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteImageUrl(image);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex
      ? { robots: { index: false, follow: false } }
      : { robots: { index: true, follow: true } }),
  };
}

export function organizationJsonLd(settings?: {
  companyName?: string;
  contactEmail?: string;
  phone?: string;
  offices?: { label: string; address: string }[];
  socialLinks?: Record<string, string | undefined>;
} | null) {
  const sameAs = Object.values(settings?.socialLinks ?? {}).filter(
    (url): url is string => Boolean(url),
  );

  return {
    "@type": "Organization",
    "@id": `${getSiteUrl()}/#organization`,
    name: settings?.companyName || SITE_NAME,
    url: getSiteUrl(),
    logo: absoluteImageUrl("/logo.png"),
    description: DEFAULT_DESCRIPTION,
    email: settings?.contactEmail || undefined,
    telephone: settings?.phone || undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    address: settings?.offices?.map((office) => ({
      "@type": "PostalAddress",
      addressLocality: office.label,
      streetAddress: office.address,
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": `${getSiteUrl()}/#website`,
    name: SITE_NAME,
    url: getSiteUrl(),
    description: DEFAULT_DESCRIPTION,
    publisher: { "@id": `${getSiteUrl()}/#organization` },
    potentialAction: {
      "@type": "ReserveAction",
      target: absoluteUrl("/booking"),
      name: "Book a free consultation",
    },
  };
}

export function articleJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  publishedAt?: string | Date;
  updatedAt?: string | Date;
  author?: { name?: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: absoluteImageUrl(post.featuredImage),
    datePublished: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : undefined,
    dateModified: post.updatedAt
      ? new Date(post.updatedAt).toISOString()
      : undefined,
    author: {
      "@type": "Person",
      name: post.author?.name || SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteImageUrl("/logo.png"),
      },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };
}

export function serviceJsonLd(service: {
  name: string;
  shortDescription: string;
  slug: string;
  priceLabel?: string;
  heroImage?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.shortDescription,
    image: absoluteImageUrl(service.heroImage),
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: getSiteUrl(),
    },
    url: absoluteUrl(`/services/${service.slug}`),
    offers: service.priceLabel
      ? {
          "@type": "Offer",
          priceCurrency: "USD",
          description: service.priceLabel,
          url: absoluteUrl(`/services/${service.slug}`),
        }
      : undefined,
  };
}

export function faqJsonLd(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export const SEO_DEFAULTS = {
  siteName: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  ogImage: DEFAULT_OG_IMAGE,
} as const;
