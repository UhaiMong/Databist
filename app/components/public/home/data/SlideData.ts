export interface Slide {
  id: string;
  headline: string;
  subtext: string;
  bannerImage: string;
  primaryButtonText: string;
  p_link: string;
  secondaryButtonText: string;
  s_link: string;
}

export const SLIDES: Slide[] = [
  {
    id: "01",
    headline: "Digital Growth Partners for Ambitious Businesses",
    subtext:
      "Web development, design, SEO, and marketing — all under one accountable team.",
    bannerImage: "/slide1.jpg",
    primaryButtonText: "Explore",
    p_link: "/contact",
    secondaryButtonText: "More",
    s_link: "/slug-title",
  },
  {
    id: "02",
    headline: "Websites Built for Speed, Security, and Conversions",
    subtext:
      "Custom-designed, responsive builds optimised for Core Web Vitals.",
    bannerImage: "/slide2.jpg",
    primaryButtonText: "Explore",
    p_link: "/contact",
    secondaryButtonText: "",
    s_link: "",
  },
  {
    id: "03",
    headline: "From Bangladesh to the UAE and Beyond",
    subtext:
      "Serving clients across multiple markets with local expertise, global standards.",
    bannerImage: "/slide3.jpg",
    primaryButtonText: "Visit",
    p_link: "/contact",
    secondaryButtonText: "Consultant",
    s_link: "/booking",
  },
];
