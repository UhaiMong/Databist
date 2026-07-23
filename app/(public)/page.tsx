import { Metadata } from "next";
import connectDB from "@/lib/db/connectDB";
import {
  ServicePackage,
  Portfolio,
  Testimonial,
  Blog,
  FaqGlobal,
  SiteSettings,
} from "@/lib/models";
import HeroSlider from "@/app/components/public/home/HeroSlider";
import TrustTrip from "./components/TrustStrip";
import GlobalPresence from "./components/GlobePresence";
import Services from "./components/Services";
import Industries from "./components/Industries";
import PortfolioShowcase from "./components/PortfolioShowcase";
import TestimonialSection from "./components/TestimonialSection";
import BookingSection from "./components/BookingSection";
import BlogSection from "./components/BlogSection";
import FaqSection from "./components/FaqSection";

export const metadata: Metadata = {
  title: "Digital Resolution | Web Development & Digital Marketing Agency",
  description:
    "Full-service digital marketing and web development agency serving Bangladesh, the UAE, and beyond. Book a free consultation today.",
};

export const revalidate = 60;

async function getHomeData() {
  await connectDB();

  const [services, portfolioItems, testimonials, posts, faqs, settings] =
    await Promise.all([
      ServicePackage.find({ status: "published" })
        .sort({ order: 1 })
        .limit(8)
        .lean(),
      Portfolio.find({ status: "completed" })
        .sort({ order: 1 })
        .limit(3)
        .lean(),
      Testimonial.find({ isFeatured: true }).sort({ order: 1 }).limit(4).lean(),
      Blog.find({ status: "published" })
        .sort({ publishedAt: -1 })
        .limit(3)
        .lean(),
      FaqGlobal.find({ isPublished: true }).sort({ order: 1 }).limit(6).lean(),
      SiteSettings.findOne({ key: "global" }).lean(),
    ]);

  return JSON.parse(
    JSON.stringify({
      services,
      portfolioItems,
      testimonials,
      posts,
      faqs,
      settings,
    }),
  );
}

export default async function HomePage() {
  const { services, portfolioItems, testimonials, posts, faqs, settings } =
    await getHomeData();

  return (
    <>
      <HeroSlider />
      <TrustTrip />
      <Services services={services} />
      <Industries />
      <PortfolioShowcase portfolioItems={portfolioItems} />
      <TestimonialSection testimonials={testimonials} />
      <GlobalPresence settings={settings} />
      <BookingSection />
      <BlogSection posts={posts} />
      <FaqSection faqs={faqs} />
    </>
  );
}
