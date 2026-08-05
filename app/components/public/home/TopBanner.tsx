import { ArrowRight } from "lucide-react";
import { Button } from "../../ui/button";

export function TopBanner() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
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
      <RegMark className="left-5 top-25" />
      <RegMark className="right-5 top-25" />
      <RegMark className="bottom-14 left-5" />
      <RegMark className="bottom-14 right-5" />

      {/* wordmark bar */}
      <div className="relative z-10 mx-auto flex max-w-310 items-center justify-between px-8 pt-7 mt-10 font-mono text-[13px] tracking-[0.08em] text-steel">
        <span className="font-display font-semibold tracking-tight text-paper">
          DATABIST<span className="align-super text-[10px] text-amber">°</span>
        </span>
        <span>IT SOLUTIONS STUDIO</span>
      </div>

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
            <Button
              size="lg"
              className="rounded-sm bg-amber text-[#1A1305] hover:bg-amber/90 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(240,168,60,0.25)]"
            >
              Start a project <ArrowRight className="ml-1 size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-sm border-blue-line-dim bg-transparent text-paper hover:border-blue-bright hover:text-blue-bright"
            >
              See the work
            </Button>
          </div>

          <div className="animate-fade-up flex flex-wrap border-t border-blue-line-dim pt-6 [animation-delay:.32s]">
            {[
              ["40+", "Systems shipped"],
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

const PATHS = [
  { d: "M90,80 L90,115 L260,115 L260,150", delay: ".35s" },
  { d: "M430,80 L430,115 L260,115 L260,150", delay: ".35s" },
  { d: "M260,200 L260,235 L90,235 L90,270", delay: "1.15s" },
  { d: "M260,200 L260,235 L430,235 L430,270", delay: "1.15s" },
  { d: "M90,320 L90,355 L260,355 L260,390", delay: "1.95s", secondary: true },
  { d: "M430,320 L430,355 L260,355 L260,390", delay: "1.95s" },
] as const;

function Schematic() {
  return (
    <div className="relative">
      <div className="rounded-md border border-blue-line-dim bg-white/[0.012] p-4 pb-3.5">
        <div className="mb-2 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.08em] text-steel">
          <span>Fig. 01 — System Overview</span>
          <span className="text-amber">● Live</span>
        </div>
        <svg
          viewBox="0 0 520 470"
          className="block h-auto w-full"
          role="img"
          aria-label="Diagram of Databist's typical system architecture: client and CDN connect to an API gateway, which routes to an auth service and app service, both writing to a shared database."
        >
          {PATHS.map((p, i) => (
            <path
              key={i}
              d={p.d}
              pathLength={1}
              className={`fill-none stroke-blue-bright stroke-[1.5] [stroke-linejoin:miter] motion-safe:animate-draw ${
                p.d ? "opacity-55 stroke-blue-line" : ""
              }`}
              style={{ animationDelay: p.delay }}
              strokeDasharray={1}
              strokeDashoffset={1}
            />
          ))}
          {NODES.map((n) => (
            <g
              key={n.id}
              className="origin-center motion-safe:animate-node-in"
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
                className="fill-amber font-mono text-[8.5px] tracking-wide"
              >
                {n.tag}
              </text>
              <text
                x={n.x + 70}
                y={n.y + 30}
                textAnchor="middle"
                className="fill-paper font-mono text-[11.5px] font-medium"
              >
                {n.label}
              </text>
              <circle
                cx={n.dotX}
                cy={n.dotY}
                r={3}
                className="fill-amber opacity-0 motion-safe:animate-dot-on"
                style={{ animationDelay: n.dotDelay }}
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
