import Link from "next/link";
import { CAPITAL_USES, GOALS, INVEST_HREF, PATHWAY, REVENUE_STREAMS } from "@/lib/content";
import { formatUsd, type SiteSettings } from "@/lib/settings";
import NotifyForm from "./NotifyForm";

/** Growth pathway with the current stage highlighted. */
export function Pathway({ dark = false }: { dark?: boolean }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7" aria-label="Royal Flow growth pathway">
      {PATHWAY.map((p, i) => {
        const done = p.status === "done";
        const cur = p.status === "current";
        return (
          <li key={p.title} aria-current={cur ? "step" : undefined}
            className={`relative rounded-xl p-4 text-sm ${
              cur ? "bg-gold-500 text-navy-950 shadow-lg ring-4 ring-gold-500/30"
                : done ? (dark ? "bg-white/10 text-cream-100" : "bg-navy-800 text-cream-100")
                : dark ? "border border-white/15 text-cream-100/70" : "border border-cream-200 bg-white text-navy-700"
            }`}>
            <span className="block text-xs font-semibold uppercase tracking-wider opacity-70">
              {done ? "✓ Complete" : cur ? "● Now" : `Step ${i + 1}`}
            </span>
            <span className="mt-1 block font-display font-semibold leading-snug">{p.title}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function CapitalTarget({ s, compact = false }: { s: SiteSettings; compact?: boolean }) {
  const pct = s.scaleUpTarget > 0 ? Math.min(100, Math.round((s.capitalCommitted / s.scaleUpTarget) * 100)) : 0;
  return (
    <div className="rounded-2xl bg-navy-800 p-7 text-cream-100 shadow-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-water-300">Scale-up capital target</p>
      <p className="mt-2 font-display text-5xl font-bold gold-text">{formatUsd(s.scaleUpTarget)}</p>
      <p className="mt-3 text-cream-100/80">
        To build the manufacturing, engineering, testing and deployment capacity that takes Riverbox from validated pilots into early commercial production.
      </p>
      {s.capitalCommitted > 0 && (
        <div className="mt-5">
          <div className="h-2.5 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Capital committed">
            <div className="h-full rounded-full bg-gradient-to-r from-water-500 to-gold-500" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-sm text-cream-100/80">{formatUsd(s.capitalCommitted)} committed · {pct}%</p>
        </div>
      )}
      {!compact && (
        <Link href={INVEST_HREF} className="btn btn-gold mt-6">Discuss investment</Link>
      )}
    </div>
  );
}

export function CapitalUses() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {CAPITAL_USES.map((c) => (
        <li key={c.title} className="rounded-xl border border-cream-200 bg-white p-5">
          <h3 className="font-display font-semibold text-navy-900">{c.title}</h3>
          <p className="mt-1 text-sm text-navy-700/85">{c.text}</p>
        </li>
      ))}
    </ul>
  );
}

export function GoalsGrid({ only }: { only?: string[] }) {
  const goals = only ? GOALS.filter((g) => only.includes(g.key)) : GOALS;
  return (
    <div className={`grid gap-6 ${goals.length > 2 ? "md:grid-cols-2" : "md:grid-cols-2"}`}>
      {goals.map((g) => (
        <section key={g.key} className="rounded-2xl border border-cream-200 bg-white p-7 shadow-sm">
          <div className="h-1 w-10 rounded bg-gold-500" />
          <h3 className="mt-4 font-display text-xl font-semibold">{g.title}</h3>
          <ul className="mt-4 space-y-2.5">
            {g.points.map((p) => (
              <li key={p} className="flex gap-3 text-navy-700/90">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-water-500" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function RevenueStreams() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {REVENUE_STREAMS.map((r, i) => (
        <li key={r} className="flex items-start gap-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          <span className="font-display text-lg font-bold text-gold-400">{String(i + 1).padStart(2, "0")}</span>
          <span className="text-sm text-cream-100/90">{r}</span>
        </li>
      ))}
    </ul>
  );
}

/** The two calls to action: Support Riverbox (payment) and Invest / Partner (conversation). */
export function SupportAndInvest({ s, headingLevel = "h2" }: { s: SiteSettings; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  const live = !!s.supportUrl;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section id="support" className="flex flex-col rounded-3xl bg-gradient-to-br from-gold-400 to-gold-500 p-8 text-navy-950 shadow-xl sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-navy-900/70">For individuals & organisations</p>
        <H className="mt-2 font-display text-3xl font-bold">Support Riverbox</H>
        <p className="mt-3 text-navy-900/85">
          Contribute financially to the development and deployment of locally engineered micro-hydro technology in Zambia.
          Contributions are received directly by Royal Flow Energy through our own verified payment channel.
        </p>
        <div className="mt-auto pt-7">
          {live ? (
            <a href={s.supportUrl} target="_blank" rel="noopener noreferrer" className="btn btn-navy">
              Support Riverbox →
            </a>
          ) : (
            <>
              <button type="button" disabled aria-disabled="true" className="btn cursor-not-allowed bg-navy-900/15 text-navy-900/60">
                Support Riverbox · opening soon
              </button>
              <p className="mt-3 text-sm text-navy-900/80">
                Our verified Royal Flow Energy payment link is being set up. Leave your email and we&apos;ll let you know when it opens.
              </p>
              <div className="mt-3 max-w-md"><NotifyForm /></div>
            </>
          )}
        </div>
      </section>

      <section id="invest" className="flex flex-col rounded-3xl bg-navy-800 p-8 text-cream-100 shadow-xl sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-water-300">For investors & partners</p>
        <H className="mt-2 font-display text-3xl font-bold">Invest / Partner with us</H>
        <p className="mt-3 text-cream-100/80">
          For investors, NGOs, energy companies, development organisations, technical partners and deployment partners who want to discuss serious collaboration.
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
          <Link href={INVEST_HREF} className="btn btn-gold">Start a conversation</Link>
          <a href={`mailto:${s.contactEmail}?subject=${encodeURIComponent("Investment / partnership — Royal Flow Energy")}`}
            className="text-sm font-semibold text-cream-100/85 underline underline-offset-4 hover:text-white break-all">
            or email {s.contactEmail}
          </a>
        </div>
      </section>
    </div>
  );
}

/** Additional verified funding channels — renders nothing until one is added in Site settings. */
export function FundingChannels({ s }: { s: SiteSettings }) {
  if (!s.fundingChannels.length) return null;
  return (
    <section aria-labelledby="channels-h" className="mt-10">
      <h3 id="channels-h" className="font-display text-xl font-semibold">Other verified ways to contribute</h3>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {s.fundingChannels.map((c) => (
          <li key={c.url} className="flex flex-col rounded-xl border border-cream-200 bg-white p-5">
            <p className="font-semibold">{c.label}</p>
            {c.note && <p className="mt-1 text-sm text-navy-700/80">{c.note}</p>}
            <a href={c.url} target="_blank" rel="noopener noreferrer" className="mt-4 text-sm font-semibold text-gold-600 hover:text-gold-500">Open →</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
