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
    headline: "The Digital Marketing and Web Development Agency You Can Trust",
    subtext:
      "Web development, design, SEO, and marketing — all under one accountable team.",
    bannerImage: "/slide1.jpg",
    primaryButtonText: "Explore",
    p_link: "/services",
    secondaryButtonText: "",
    s_link: "",
  },
  {
    id: "02",
    headline: "Websites Built for Speed, Security, and Conversions",
    subtext:
      "Custom-designed, responsive builds optimised for Core Web Vitals.",
    bannerImage: "/slide2.jpg",
    primaryButtonText: "Contact",
    p_link: "/contact",
    secondaryButtonText: "",
    s_link: "",
  },
  {
    id: "03",
    headline:
      "Serving Clients Across Multiple Markets with Local Expertise, Global Standards",
    subtext:
      "Serving clients across multiple markets with local expertise, global standards.",
    bannerImage: "/slide3.jpg",
    primaryButtonText: "Consultant",
    p_link: "/booking",
    secondaryButtonText: "",
    s_link: "",
  },
];
