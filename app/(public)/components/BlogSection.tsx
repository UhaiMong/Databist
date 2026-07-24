import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DesignTokens, fraunces, plexMono } from "@/lib/utils";

function FeaturedPost({ post }: { post: any }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-sm ring-1 transition-colors lg:col-span-2 lg:row-span-2"
      style={{
        background: DesignTokens.surface,
        borderColor: DesignTokens.hairline,
      }}
    >
      <div
        className="relative aspect-video w-full overflow-hidden"
        style={{ background: DesignTokens.bg }}
      >
        {post.featuredImage && (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            loading="eager"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        )}
        {post.category && (
          <span
            className="absolute bottom-1 left-5 z-10 rounded-full border px-3 py-1 text-[10px] tracking-[0.15em] uppercase"
            style={{
              fontFamily: "var(--font-plex-mono)",
              background: DesignTokens.surface,
              borderColor: `${DesignTokens.gold}66`,
              color: DesignTokens.gold,
            }}
          >
            {post.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-7 sm:px-6">
        <h3
          className="text-2xl italic leading-snug sm:text-3xl"
          style={{
            fontFamily: "var(--font-fraunces)",
            color: DesignTokens.ink,
          }}
        >
          {post.title}
        </h3>

        {post.excerpt && (
          <p
            className="mt-3 line-clamp-3 text-sm leading-relaxed"
            style={{ color: DesignTokens.body }}
          >
            {post.excerpt}
          </p>
        )}

        <span
          className="mt-auto inline-flex items-center gap-1 pt-5 text-[11px] tracking-[0.15em] uppercase transition-colors"
          style={{
            fontFamily: "var(--font-plex-mono)",
            color: DesignTokens.muted,
          }}
        >
          Read dispatch
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

function BriefPost({ post }: { post: any }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-4 overflow-hidden rounded-sm p-3 ring-1 transition-colors"
      style={{
        background: DesignTokens.surface,
        borderColor: DesignTokens.hairline,
      }}
    >
      <div
        className="relative h-20 w-24 shrink-0 overflow-hidden rounded-sm sm:h-24 sm:w-28"
        style={{ background: DesignTokens.bg }}
      >
        {post.featuredImage && (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="120px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-center">
        {post.category && (
          <span
            className="text-[10px] tracking-[0.15em] uppercase"
            style={{
              fontFamily: "var(--font-plex-mono)",
              color: DesignTokens.gold,
            }}
          >
            {post.category}
          </span>
        )}
        <h3
          className="mt-1 line-clamp-2 text-sm italic leading-snug sm:text-base"
          style={{
            fontFamily: "var(--font-fraunces)",
            color: DesignTokens.ink,
          }}
        >
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

export default function BlogSection({ posts }: { posts: any }) {
  if (!posts?.length) {
    return (
      <section
        className="w-full py-16 text-center text-sm"
        style={{
          background: DesignTokens.bg,
          color: DesignTokens.muted,
          fontFamily: "var(--font-plex-mono)",
        }}
      >
        No dispatches yet.
      </section>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <section
      className={`${fraunces.variable} ${plexMono.variable} w-full px-4 py-24 sm:px-6`}
      style={{ background: DesignTokens.bg }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 max-w-xl md:mb-16">
          <span
            className="block text-[11px] tracking-[0.25em] uppercase"
            style={{
              fontFamily: "var(--font-plex-mono)",
              color: DesignTokens.muted,
            }}
          >
            From the Desk
          </span>
          <h2
            className="mt-3 text-4xl italic sm:text-5xl"
            style={{
              fontFamily: "var(--font-fraunces)",
              color: DesignTokens.ink,
            }}
          >
            Recent dispatches
          </h2>
        </div>

        {/* Editorial grid: one featured post + compact briefs */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeaturedPost post={featured} />
          {rest.map((post: any) => (
            <BriefPost key={post.slug} post={post} />
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 border-b pb-1 text-xs tracking-[0.2em] uppercase transition-colors"
            style={{
              fontFamily: "var(--font-plex-mono)",
              color: DesignTokens.ink,
              borderColor: DesignTokens.hairline,
            }}
          >
            Read more articles
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
