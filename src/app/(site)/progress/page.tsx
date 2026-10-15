import type { Metadata } from "next";
import Link from "next/link";
import { GoalsGrid, Pathway } from "@/components/growth";
import Photo from "@/components/Photo";
import { CtaBand, PageHero, SectionTitle } from "@/components/ui";
import { CURRENT_STAGE, PILOT_DESIGN } from "@/lib/content";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Current Progress & Impact",
  description: "Riverbox has moved beyond the concept stage: the prototype is developed and we are completing integration, testing and field validation.",
};

const VALIDATING = [
  { title: "Mechanical performance", text: "Turbine, drivetrain and structure under real river conditions." },
  { title: "Electrical performance", text: "Generator integration, control, protection and power quality." },
  { title: "Varying capacities", text: "Pilot systems tested at different capacities and operating conditions." },
  { title: "Repeatable production", text: "Engineering, fabrication and testing procedures ready for production." },
];

const IMPACT = [
  { title: "Reliable local power", text: "Continuous electricity from small rivers, day and night, for communities beyond the grid." },
  { title: "Productive use", text: "Power for agriculture, milling, cold storage, small enterprises and community services." },
  { title: "Local skills & jobs", text: "Machinists, fabricators, welders, electrical technicians and installers trained in Zambia." },
  { title: "Clean energy", text: "Displacing diesel and kerosene with renewable run-of-river hydropower — no large dam required." },
];

export default async function ProgressPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero eyebrow="Current progress" title="Beyond the concept stage"
        intro="The Riverbox prototype has been developed. We are now validating it through pilots and preparing to build the capacity needed for commercial deployment." />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">Current stage</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{CURRENT_STAGE.label}</h2>
            <p className="mt-4 text-lg text-navy-700/90">{CURRENT_STAGE.summary}</p>
            <p className="mt-3 text-sm text-navy-700/70">{CURRENT_STAGE.note}</p>
            <Photo name="site-visit" alt="The Royal Flow team speaking with a community member during a site visit" caption="Community site visit" className="mt-8" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {VALIDATING.map((v) => (
              <div key={v.title} className="rounded-2xl border border-cream-200 bg-white p-6 shadow-sm">
                <h3 className="font-display font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm text-navy-700/85">{v.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold">Where we are on the pathway</h2>
          <Pathway />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionTitle eyebrow="Pilot design" title="How each pilot site works" />
            <div className="mt-8 space-y-5">
              {PILOT_DESIGN.map((p) => (
                <div key={p.title} className="flex gap-4">
                  <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-gold-500" />
                  <div>
                    <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                    <p className="mt-1 text-navy-700/85">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Photo name="community-engagement" alt="The Royal Flow team reviewing plans with community members" caption="Community engagement" />
        </div>
      </section>

      <section className="bg-cream-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="Next" title="Short-term goals" />
          <div className="mt-10"><GoalsGrid only={["short"]} /></div>
        </div>
      </section>

      <section id="impact" className="bg-navy-800 py-20 text-cream-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-water-300">Impact</p>
          <h2 className="mt-2 max-w-3xl font-display text-3xl font-bold sm:text-4xl">What Riverbox makes possible</h2>
          <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {s.stats.map((st) => (
              <div key={st.label} className="rounded-2xl bg-white/5 p-6 text-center ring-1 ring-white/10">
                <dd className="font-display text-3xl font-bold gold-text">{st.value}</dd>
                <dt className="mt-1 text-sm text-cream-100/75">{st.label}</dt>
              </div>
            ))}
          </dl>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {IMPACT.map((i) => (
              <div key={i.title}>
                <h3 className="font-display text-lg font-semibold text-gold-400">{i.title}</h3>
                <p className="mt-2 text-sm text-cream-100/80">{i.text}</p>
              </div>
            ))}
          </div>
          <Link href="/growth" className="mt-10 inline-block font-semibold text-gold-400 hover:text-gold-300">See our growth goals →</Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
