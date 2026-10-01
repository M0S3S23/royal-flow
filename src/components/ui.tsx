import Link from "next/link";
import type { ReactNode } from "react";
import { INVEST_HREF } from "@/lib/content";

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-cream-100">
      <div className="absolute inset-0 opacity-30 [background:radial-gradient(60%_80%_at_85%_10%,#4a9fd8_0%,transparent_60%),radial-gradient(40%_60%_at_10%_90%,#c9a24a_0%,transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 sm:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-water-300">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg text-cream-100/80">{intro}</p>}
      </div>
      <div className="wave-divider absolute inset-x-0 bottom-0 h-12" />
    </section>
  );
}

export function SectionTitle({ eyebrow, title, intro, center }: { eyebrow?: string; title: string; intro?: ReactNode; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">{eyebrow}</p>}
      <h2 className="mt-2 font-display text-3xl font-bold text-navy-900 sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-lg text-navy-700/85">{intro}</p>}
    </div>
  );
}

export function CtaBand({ title = "Help take Riverbox from pilot to production" }: { title?: string }) {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-navy-800 px-6 py-12 text-center text-cream-100 shadow-xl sm:px-12">
        <h2 className="font-display text-3xl font-bold">{title}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-cream-100/80">
          Contribute to the development and deployment of Riverbox, or talk to us about investment and partnership.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/support" className="btn btn-gold">Support Riverbox</Link>
          <Link href={INVEST_HREF} className="btn btn-outline text-cream-100 hover:bg-white/10">Invest / Partner with us</Link>
        </div>
      </div>
    </section>
  );
}
