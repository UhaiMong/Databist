import { ArrowRight } from "lucide-react";
import { Button } from "../../ui/button";
import Link from "next/link";

export function TopBanner() {
  return (
    <section className="relative overflow-hidden bg-page-bg text-paper">
      {/* drafting grid + vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-35 mask-[radial-gradient(ellipse_90%_80%_at_50%_30%,black_40%,transparent_90%)]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-blue-line-dim) 1px, transparent 1px), linear-gradient(90deg, var(--color-blue-line-dim) 1px, transparent 1px), linear-gradient(rgba(78,122,152,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(78,122,152,0.35) 1px, transparent 1px)",
          backgroundSize: "24px 24px, 24px 24px, 120px 120px, 120px 120px",
        }}
      />

      {/* corner registration marks */}
      <RegMark className="left-5 top-14" />
      <RegMark className="right-5 top-14" />
      <RegMark className="bottom-14 left-5" />
      <RegMark className="bottom-14 right-5" />

      {/* wordmark bar */}
      {/* <div className="relative z-10 mx-auto flex max-w-310 items-center justify-between px-8 pt-7 mt-10 font-mono text-[13px] tracking-[0.08em] text-steel">
        <span className="font-display font-semibold tracking-tight text-paper">
          <span className="align-super text-[10px] text-amber">°</span>
        </span>
        <span>IT SOLUTIONS STUDIO</span>
      </div> */}

      <div className="relative z-10 mx-auto grid max-w-310 grid-cols-1 items-center gap-12 px-8 pb-10 pt-16 md:grid-cols-[1.05fr_0.95fr] md:pt-20">
        {/* left column */}
        <div>
          <div className="animate-fade-up mb-7 inline-flex items-center gap-2 rounded-sm border border-blue-line-dim bg-blue-line-dim/10 px-3 py-1.5 font-mono text-[12.5px] uppercase tracking-[0.14em] text-blue-bright [animation-delay:0s]">
            <span className="h-1.5 w-1.5 animate-status-pulse rounded-full bg-amber shadow-[0_0_0_3px_rgba(240,168,60,0.18)]" />
            Status: accepting new projects
          </div>

          <h1 className="animate-fade-up mb-6 font-display text-[2.4rem] font-semibold leading-[1.08] tracking-tight text-paper [animation-delay:.08s] md:text-[3.4rem]">
            Every system starts
            <br />
            as a drawing. We build
            <br />
            the ones that <span className="text-amber">ship</span>.
          </h1>

          <p className="animate-fade-up mb-9 max-w-[46ch] text-[17px] leading-relaxed text-steel [animation-delay:.16s]">
            Databist designs and builds web applications and IT infrastructure
            for teams who need software that holds up in production — not just
            in the demo.
          </p>

          <div className="animate-fade-up mb-14 flex flex-wrap gap-3.5 [animation-delay:.24s]">
            <Link
              href="/contact"
              className="flex items-center gap-2.5 py-0.5 px-1 rounded-sm bg-yellow-500 text-white hover:bg-yellow-600 hover:-translate-y-px hover:shadow-xl"
            >
              Start a project <ArrowRight className="ml-1 size-4" />
            </Link>
            <Link
              href="/portfolio"
              className="py-0.5 px-1 rounded-sm border-blue-line-dim bg-brand text-paper hover:border-blue-bright hover:text-blue-bright"
            >
              See the work
            </Link>
          </div>

          <div className="animate-fade-up flex flex-wrap border-t border-blue-line-dim pt-6 [animation-delay:.32s]">
            {[
              ["15+", "Systems shipped"],
              ["99.9%", "Uptime SLA"],
              ["12", "Industries served"],
            ].map(([num, label], i) => (
              <div
                key={label}
                className="mr-7 border-r border-blue-line-dim pr-7 last:mr-0 last:border-r-0 last:pr-0"
              >
                <span className="block font-mono text-[22px] font-semibold text-paper">
                  {num}
                </span>
                <span className="font-mono text-[10.5px] uppercase tracking-widest text-steel">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* right column — signature schematic */}
        <Schematic />
      </div>

      {/* title block */}
      <div className="relative z-10 border-t border-blue-line-dim">
        <div className="mx-auto flex max-w-310 flex-wrap gap-6 px-8 py-3.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-steel">
          <span>
            Drawing No. <b className="font-medium text-paper">DB—HERO—01</b>
          </span>
          <span className="text-blue-line-dim">·</span>
          <span>
            Rev <b className="font-medium text-paper">2026.08</b>
          </span>
          <span className="text-blue-line-dim">·</span>
          <span>
            Scale <b className="font-medium text-paper">NTS</b>
          </span>
          <span className="text-blue-line-dim">·</span>
          <span>
            Status <b className="font-medium text-paper">Shipped</b>
          </span>
        </div>
      </div>
    </section>
  );
}

function RegMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute z-10 h-4.5 w-4.5 opacity-55 ${className}`}
    >
      <span className="absolute left-2 top-0 h-4.5 w-0.5 bg-blue-line" />
      <span className="absolute left-0 top-2 h-0.5 w-4.5 bg-blue-line" />
    </span>
  );
}

/** Node + connector data for the "system boot" diagram. */
const NODES = [
  {
    id: "n1",
    tag: "N.01",
    label: "CLIENT",
    x: 20,
    y: 30,
    dotX: 150,
    dotY: 40,
    delay: "0s",
    dotDelay: ".1s",
  },
  {
    id: "n2",
    tag: "N.02",
    label: "CDN",
    x: 360,
    y: 30,
    dotX: 490,
    dotY: 40,
    delay: "0s",
    dotDelay: ".1s",
  },
  {
    id: "n3",
    tag: "N.03",
    label: "API GATEWAY",
    x: 190,
    y: 150,
    dotX: 320,
    dotY: 160,
    delay: ".9s",
    dotDelay: "1s",
  },
  {
    id: "n4",
    tag: "N.04",
    label: "AUTH SERVICE",
    x: 20,
    y: 270,
    dotX: 150,
    dotY: 280,
    delay: "1.7s",
    dotDelay: "1.8s",
  },
  {
    id: "n5",
    tag: "N.05",
    label: "APP SERVICE",
    x: 360,
    y: 270,
    dotX: 490,
    dotY: 280,
    delay: "1.7s",
    dotDelay: "1.8s",
  },
  {
    id: "n6",
    tag: "N.06",
    label: "DATABASE",
    x: 190,
    y: 390,
    dotX: 320,
    dotY: 400,
    delay: "2.5s",
    dotDelay: "2.6s",
  },
] as const;

// Static connector lines (unchanged geometry, cleaned up — the dead `secondary` flag is gone)
const PATHS = [
  { d: "M90,80 L90,115 L260,115 L260,150", delay: ".35s" },
  { d: "M430,80 L430,115 L260,115 L260,150", delay: ".35s" },
  { d: "M260,200 L260,235 L90,235 L90,270", delay: "1.15s" },
  { d: "M260,200 L260,235 L430,235 L430,270", delay: "1.15s" },
  { d: "M90,320 L90,355 L260,355 L260,390", delay: "1.95s" },
  { d: "M430,320 L430,355 L260,355 L260,390", delay: "1.95s" },
] as const;

// New: the return leg the "response" travels along, back to the client.
// Routed off to the left of the canvas so it doesn't overlap the request paths.
const RETURN_PATH = "M260,440 L260,455 L-25,455 L-25,55 L20,55";

// One full request/response loop = 7s, repeating forever.
const CYCLE_SECONDS = 7;

// Each entry: which path the pulse rides, and what % of the cycle it's "in flight".
const SIGNALS = [
  { d: PATHS[0].d, start: 0, end: 15, color: "var(--sig-request)" },
  { d: PATHS[1].d, start: 0, end: 15, color: "var(--sig-request)" },
  { d: PATHS[2].d, start: 20, end: 38, color: "var(--sig-request)" },
  { d: PATHS[3].d, start: 27, end: 45, color: "var(--sig-request)" },
  { d: PATHS[4].d, start: 50, end: 68, color: "var(--sig-request)" },
  { d: PATHS[5].d, start: 50, end: 68, color: "var(--sig-request)" },
  { d: RETURN_PATH, start: 74, end: 97, color: "var(--sig-response)" },
] as const;

// Glow rings on each node, timed to when a signal arrives/departs.
const NODE_GLOWS = [
  { id: "n2", x: 360, y: 30, start: 0, end: 3 },
  { id: "n3", x: 190, y: 150, start: 13, end: 22 },
  { id: "n4", x: 20, y: 270, start: 36, end: 42 },
  { id: "n5", x: 360, y: 270, start: 43, end: 49 },
  { id: "n6", x: 190, y: 390, start: 66, end: 76 },
] as const;

function buildStyles() {
  const base = `
    :root {
      --sig-request: #7dd3fc;
      --sig-response: #34d399;
    }
    @keyframes sig-draw { to { stroke-dashoffset: 0; } }
    @keyframes sig-node-in {
      from { opacity: 0; transform: scale(0.94); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes sig-dot-on { to { opacity: 1; } }
    .sig-path { animation: sig-draw 0.6s ease-out forwards; }
    .sig-node { animation: sig-node-in 0.5s ease-out forwards; opacity: 0; }
    .sig-dot { animation: sig-dot-on 0.3s ease-out forwards; opacity: 0; }

    /* Client glow wraps the loop boundary: lights up on request-out (0-3%)
       and again on response-in (96-100% -> 0%). */
    @keyframes glow-n1 {
      0% { opacity: 1; }
      4% { opacity: 0; }
      94% { opacity: 0; }
      96% { opacity: 1; }
      100% { opacity: 1; }
    }
    .glow-n1 { animation: glow-n1 ${CYCLE_SECONDS}s linear infinite; }
  `;

  const pulses = SIGNALS.map(
    (s, i) => `
    @keyframes pulse-${i} {
      0%, ${s.start}% { opacity: 0; offset-distance: 0%; }
      ${s.start + 0.5}% { opacity: 1; }
      ${s.end}% { offset-distance: 100%; opacity: 1; }
      ${Math.min(s.end + 1, 100)}%, 100% { opacity: 0; offset-distance: 100%; }
    }
    .pulse-${i} {
      offset-path: path("${s.d}");
      animation: pulse-${i} ${CYCLE_SECONDS}s linear infinite;
    }
  `,
  ).join("\n");

  const glows = NODE_GLOWS.map(
    (g, i) => `
    @keyframes glow-${g.id}-${i} {
      0%, ${g.start}% { opacity: 0; }
      ${g.start + 1}% { opacity: 1; }
      ${g.end}% { opacity: 1; }
      ${Math.min(g.end + 2, 100)}%, 100% { opacity: 0; }
    }
    .glow-${g.id}-${i} { animation: glow-${g.id}-${i} ${CYCLE_SECONDS}s linear infinite; }
  `,
  ).join("\n");

  const reduced = `
    @media (prefers-reduced-motion: reduce) {
      .sig-path, .sig-node, .sig-dot {
        animation: none !important; opacity: 1 !important; stroke-dashoffset: 0 !important;
      }
      [class*="pulse-"], [class*="glow-"] { animation: none !important; opacity: 0 !important; }
    }
  `;

  return base + pulses + glows + reduced;
}

function Schematic() {
  return (
    <div className="relative">
      <style>{buildStyles()}</style>
      <div className="rounded-md border border-blue-line-dim bg-white/[0.012] p-4 pb-3.5">
        <div className="mb-2 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.08em] text-steel">
          <span>Fig. 01 — System Overview</span>
          <span className="text-amber animate-pulse">● Live</span>
        </div>
        <svg
          viewBox="-50 -15 610 500"
          className="block h-auto w-full"
          role="img"
          aria-label="Diagram of Databist's typical system architecture: client and CDN connect to an API gateway, which routes to an auth service and app service, both writing to a shared database, with live request/response signal animation."
        >
          <defs>
            <filter id="pulseGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="nodeGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>

          {/* Static connectors, including the new return route */}
          {PATHS.map((p, i) => (
            <path
              key={i}
              d={p.d}
              pathLength={1}
              className="sig-path fill-none stroke-blue-line stroke-[1.5] opacity-55  [stroke-linejoin:miter]"
              style={{ animationDelay: p.delay }}
              strokeDasharray={1}
              strokeDashoffset={1}
            />
          ))}
          <path
            d={RETURN_PATH}
            pathLength={1}
            className="sig-path fill-none stroke-blue-bright stroke-[1.5] opacity-30 stroke-dasharray-2 [stroke-linejoin:round]"
            style={{ animationDelay: "2.5s", strokeDasharray: "4 3" }}
            strokeDashoffset={0}
          />

          {/* Node glow rings (rendered under the nodes) */}
          {NODE_GLOWS.map((g, i) => (
            <rect
              key={`glow-${i}`}
              x={g.x - 3}
              y={g.y - 3}
              width={146}
              height={56}
              rx={5}
              className={`glow-${g.id}-${i} fill-none stroke-[2.5]`}
              stroke="var(--sig-request)"
              filter="url(#nodeGlow)"
            />
          ))}
          <rect
            x={NODES[0].x - 3}
            y={NODES[0].y - 3}
            width={146}
            height={56}
            rx={5}
            className="glow-n1 fill-none stroke-[2.5]"
            stroke="var(--sig-response)"
            filter="url(#nodeGlow)"
          />

          {/* Nodes */}
          {NODES.map((n) => (
            <g
              key={n.id}
              className="sig-node origin-center"
              style={{ animationDelay: n.delay, transformBox: "fill-box" }}
            >
              <rect
                x={n.x}
                y={n.y}
                width={140}
                height={50}
                rx={3}
                className="fill-ink-2 stroke-blue-line stroke-[1.4]"
              />
              <text
                x={n.x + 8}
                y={n.y - 4}
                className="fill-amber font-bold font-mono text-[14px] tracking-wide"
              >
                {n.tag}
              </text>
              <text
                x={n.x + 70}
                y={n.y + 30}
                textAnchor="middle"
                className="fill-paper font-mono text-base font-medium"
              >
                {n.label}
              </text>
              <circle
                cx={n.dotX}
                cy={n.dotY}
                r={3}
                className="sig-dot font-black fill-green-600"
                style={{ animationDelay: n.dotDelay }}
              />
            </g>
          ))}

          {/* Traveling signal pulses */}
          {SIGNALS.map((s, i) => (
            <circle
              key={`pulse-${i}`}
              cx={0}
              cy={0}
              r={4}
              fill={s.color}
              className={`pulse-${i}`}
              filter="url(#pulseGlow)"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
