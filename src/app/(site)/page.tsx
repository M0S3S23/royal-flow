import Image from "next/image";
import Link from "next/link";
import { CapitalTarget, Pathway, SupportAndInvest } from "@/components/growth";
import PostCard from "@/components/PostCard";
import TeamGrid from "@/components/TeamGrid";
import { SectionTitle } from "@/components/ui";
import { CAPITAL_USES, CURRENT_STAGE, GOALS, INVEST_HREF } from "@/lib/content";
import { getPublishedPosts } from "@/lib/posts";
import { getSettings } from "@/lib/settings";
import { getTeam } from "@/lib/team";

const STEPS = [
  { n: "01", title: "Water flows in", text: "Riverbox sits in a stream or channel with as little as 1–5 metres of head — no large dam required." },
  { n: "02", title: "The turbine spins", text: "A locally engineered low-head turbine turns moving water into rotation, day and night." },
  { n: "03", title: "Power is delivered", text: "An integrated generator and control system supply electricity to nearby homes and enterprises." },
];

const PROBLEMS = [
  { title: "Beyond the grid", text: "Many rural Zambian communities remain unconnected to the national grid, or receive unreliable supply." },
  { title: "Costly alternatives", text: "Diesel generators and kerosene are expensive, polluting and depend on fuel transported over long distances." },
  { title: "Untapped rivers", text: "Small streams flow past these communities every day — a clean energy resource that is rarely used." },
];

export default async function HomePage() {
  const [settings, { posts }, team] = await Promise.all([getSettings(), getPublishedPosts({ perPage: 3 }), getTeam()]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900 text-cream-100">
        <div className="absolute inset-0 opacity-40 [background:radial-gradient(50%_70%_at_80%_30%,#4a9fd8_0%,transparent_60%),radial-gradient(40%_50%_at_0%_100%,#c9a24a_0%,transparent_65%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-28 pt-16 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:pt-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400" /> Now in field validation
            </p>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] sm:text-6xl">
              Locally engineered hydropower, <span className="gold-text">from the rivers</span> that already flow past.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-cream-100/80">
              Royal Flow Energy is a Zambian engineering company developing <strong className="text-white">Riverbox</strong>, a low-head
              micro-hydro system. We have moved beyond the concept stage: we are validating Riverbox through pilots and preparing
              for commercial deployment.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/support" className="btn btn-gold">Support Riverbox</Link>
              <Link href={INVEST_HREF} className="btn btn-outline text-cream-100 hover:bg-white/10">Invest / Partner with us</Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-6 rounded-full bg-water-500/30 blur-3xl" />
            <Image src="/logo.png" alt="Royal Flow Energy emblem: a crown above a gear and river waves" width={512} height={512} priority
              className="relative w-full drop-shadow-2xl" />
          </div>
        </div>
        <div className="wave-divider absolute inset-x-0 bottom-0 h-14" />
      </section>

      {/* About */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionTitle eyebrow="About" title="Energy access is still out of reach for too many"
          intro="Electricity powers study after dark, safe clinics, cold storage and small businesses. Riverbox is designed to bring that power to communities beside Zambia's rivers." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <div key={p.title} className="rounded-2xl bg-cream-50 p-7 ring-1 ring-cream-200">
              <div className="h-1 w-10 rounded bg-gold-500" />
              <h3 className="mt-5 font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-navy-700/85">{p.text}</p>
            </div>
          ))}
        </div>
        <Link href="/about" className="mt-8 inline-block font-semibold text-gold-600 hover:text-gold-500">About Royal Flow Energy →</Link>
      </section>

      {/* Riverbox */}
      <section className="bg-navy-800 py-24 text-cream-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-water-300">Riverbox</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Simple to install. Built to be maintained locally.</h2>
          </div>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-2xl border border-white/10 bg-white/5 p-7">
                <span className="font-display text-4xl font-bold gold-text">{s.n}</span>
                <h3 className="mt-3 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-cream-100/75">{s.text}</p>
              </li>
            ))}
          </ol>
          <Link href="/riverbox" className="mt-10 inline-block font-semibold text-gold-400 hover:text-gold-300">Explore the technology →</Link>
        </div>
      </section>

      {/* Current progress */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <SectionTitle eyebrow="Current progress" title={CURRENT_STAGE.label} />
          <p className="text-lg text-navy-700/85">{CURRENT_STAGE.summary}</p>
        </div>
        <div className="mt-10"><Pathway /></div>
        <Link href="/progress" className="mt-8 inline-block font-semibold text-gold-600 hover:text-gold-500">See current progress →</Link>
      </section>

      {/* Impact */}
      <section className="bg-cream-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="Impact" title="Built for real-world scale" center />
          <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {settings.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse rounded-2xl border border-cream-200 bg-white p-6 text-center shadow-sm">
                <dt className="mt-1 text-sm text-navy-700">{s.label}</dt>
                <dd className="font-display text-3xl font-bold text-navy-900">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Growth goals */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionTitle eyebrow="Growth goals" title="From pilots to a Zambian hydropower company" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GOALS.map((g) => (
            <div key={g.key} className="rounded-2xl border border-cream-200 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold">{g.title}</h3>
              <p className="mt-2 text-sm text-navy-700/85">{g.points[0]}</p>
            </div>
          ))}
        </div>
        <Link href="/growth" className="mt-8 inline-block font-semibold text-gold-600 hover:text-gold-500">All growth goals →</Link>
      </section>

      {/* Investment */}
      <section className="bg-cream-50 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <CapitalTarget s={settings} />
          <div>
            <SectionTitle eyebrow="Investment" title="What the capital supports" />
            <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {CAPITAL_USES.map((c) => (
                <li key={c.title} className="flex gap-3">
                  <span aria-hidden="true" className="mt-1 text-gold-600">✓</span>
                  <span className="text-navy-800">{c.title}</span>
                </li>
              ))}
            </ul>
            <Link href="/growth#investment" className="mt-8 inline-block font-semibold text-gold-600 hover:text-gold-500">Investment details →</Link>
          </div>
        </div>
      </section>

      {/* Support / Invest */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SupportAndInvest s={settings} />
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section className="bg-cream-50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionTitle eyebrow="Team" title="The people behind Riverbox" />
              <Link href="/team" className="font-semibold text-gold-600 hover:text-gold-500">Team & partners →</Link>
            </div>
            <div className="mt-10"><TeamGrid members={team} columns={team.length === 5 ? 5 : 4} compact /></div>
          </div>
        </section>
      )}

      {/* News */}
      {posts.length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionTitle eyebrow="Latest" title="News & updates" />
              <Link href="/news" className="font-semibold text-gold-600 hover:text-gold-500">All news →</Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 rounded-3xl bg-navy-800 px-6 py-12 text-center text-cream-100 sm:px-12">
          <h2 className="font-display text-3xl font-bold">Get in touch</h2>
          <p className="max-w-2xl text-cream-100/80">Questions about Riverbox, a potential site, or working with us? We&apos;d love to hear from you.</p>
          <Link href="/contact" className="btn btn-gold mt-2">Contact us</Link>
        </div>
      </section>
    </>
  );
}
