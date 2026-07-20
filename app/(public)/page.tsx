import FaqPage from "./faq/page";

// export default function HomePage() {
//   return (
//     <>
//       <FaqPage />
//     </>
//   );
// }

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import connectDB from "@/lib/db/connectDB";
import {
  ServicePackage,
  Portfolio,
  Testimonial,
  Blog,
  FaqGlobal,
  SiteSettings,
} from "@/lib/models";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { MapPin, ArrowRight, Star } from "lucide-react";
import HeroSlider from "@/app/components/public/home/HeroSlider";
import IndustriesGrid from "@/app/components/public/home/IndustriesGrid";
import BookingWidget from "@/app/components/public/booking/BookingWidget";
import FaqAccordion from "@/app/components/public/faq/FaqAccordion";

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
      Portfolio.find({ status: "published" })
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

const INDUSTRIES = [
  { name: "Fashion & Apparel", icon: "shirt" },
  { name: "Retail & E-commerce", icon: "shopping-cart" },
  { name: "Real Estate", icon: "building" },
  { name: "Education", icon: "graduation-cap" },
  { name: "Professional Services", icon: "briefcase" },
];

export default async function HomePage() {
  const { services, portfolioItems, testimonials, posts, faqs, settings } =
    await getHomeData();

  return (
    <>
      <HeroSlider />

      {/* Trust strip */}
      <section className="border-y bg-muted/30 py-6">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 text-center sm:grid-cols-4">
          <div>
            <p className="text-2xl font-bold text-primary">6+</p>
            <p className="text-sm text-muted-foreground">Years in Operation</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">150+</p>
            <p className="text-sm text-muted-foreground">Clients Served</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">10+</p>
            <p className="text-sm text-muted-foreground">Countries Served</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-primary">
              <Star className="h-5 w-5 fill-primary" />
              <span className="text-2xl font-bold">4.9</span>
            </div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </div>
        </div>
      </section>

      {/* Services overview grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Our Services</h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to build and grow your digital presence, under
            one roof.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service: any) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group rounded-lg border p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="font-semibold">{service.name}</h3>
              <p className="mt-1 text-sm font-medium text-primary">
                {service.priceLabel}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                {service.shortDescription}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/services">
              View All Services <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Industries served */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Industries We Serve
            </h2>
          </div>
          <IndustriesGrid industries={INDUSTRIES} />
        </div>
      </section>

      {/* Engagement model */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">How We Work</h2>
          <p className="mt-4 text-muted-foreground">
            We price by project, not by the hour — so you know the full cost
            upfront. Need more than one service? Our Combo/All-in-One Package
            bundles Website, Social Media, SEO, and Content Writing at a
            discounted combined rate.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/services">
              Explore Packages <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Portfolio highlights */}
      {portfolioItems.length > 0 && (
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">Recent Work</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {portfolioItems.map((item: any) => (
                <Link
                  key={item.slug}
                  href={`/portfolio/${item.slug}`}
                  className="group overflow-hidden rounded-lg border bg-background"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2">
                      {item.serviceType}
                    </Badge>
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link href="/portfolio">
                  View All Work <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              What Clients Say
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {testimonials.map((t: any) => (
              <div key={t._id} className="rounded-lg border p-6">
                <div className="mb-3 flex gap-1 text-primary">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold">{t.clientName}</p>
                {(t.clientRole || t.companyName) && (
                  <p className="text-xs text-muted-foreground">
                    {t.clientRole}
                    {t.clientRole && t.companyName ? ", " : ""}
                    {t.companyName}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Global presence */}
      {settings?.offices?.length > 0 && (
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Global Presence
              </h2>
            </div>
            <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
              {settings.offices.map((office: any) => (
                <div
                  key={office.label}
                  className="flex gap-4 rounded-lg border bg-background p-6"
                >
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">{office.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {office.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking widget */}
      <section id="booking" className="container mx-auto px-4 py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Book a Free Consultation
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pick a time that works for you — no back-and-forth emails.
          </p>
        </div>
        <BookingWidget />
      </section>

      {/* Latest blog posts */}
      {posts.length > 0 && (
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                From the Blog
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {posts.map((post: any) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-lg border bg-background"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {post.featuredImage && (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2">
                      {post.category}
                    </Badge>
                    <h3 className="line-clamp-2 font-semibold leading-snug">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link href="/blog">
                  Read More Articles <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* FAQ preview */}
      {faqs.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>
            <FaqAccordion items={faqs} />
            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link href="/faq">
                  View All FAQs <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
