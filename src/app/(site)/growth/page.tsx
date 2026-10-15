import type { Metadata } from "next";
import { CapitalTarget, CapitalUses, GoalsGrid, Pathway, RevenueStreams, SupportAndInvest } from "@/components/growth";
import Photo from "@/components/Photo";
import { PageHero, SectionTitle } from "@/components/ui";
import { SCALE_UP_INTRO } from "@/lib/content";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Growth & Investment",
  description: "Royal Flow Energy is seeking US$70,000 in scale-up capital to move Riverbox from validated pilots into early commercial production.",
};

export default async function GrowthPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero eyebrow="Growth & investment" title="From validated pilots to commercial scale"
        intro="We are building the manufacturing, engineering and project-delivery capacity needed to deploy Riverbox across Zambia and Southern Africa." />

      {/* Goals */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionTitle eyebrow="Growth goals" title="Where we are going" />
        <div className="mt-10"><GoalsGrid /></div>
      </section>

      {/* Pathway */}
      <section className="bg-cream-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-6 font-display text-2xl font-bold">Our growth pathway</h2>
          <Pathway />
        </div>
      </section>

      {/* Investment */}
      <section id="investment" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-6">
            <SectionTitle eyebrow="Investment" title="Scale-up capital" intro={SCALE_UP_INTRO} />
            <CapitalTarget s={s} />
            <Photo name="crossflow-drawing" alt="Riverbox crossflow turbine assembly drawing" caption="Designed for fabrication in local Zambian workshops" />
          </div>
          <div>
            <h3 className="mb-4 font-display text-xl font-semibold">What the capital supports</h3>
            <CapitalUses />
          </div>
        </div>
      </section>

      {/* Business model */}
      <section className="bg-navy-900 py-20 text-cream-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-water-300">Business model</p>
          <h2 className="mt-2 max-w-3xl font-display text-3xl font-bold sm:text-4xl">More than selling turbines</h2>
          <p className="mt-4 max-w-3xl text-cream-100/80">
            Royal Flow Energy is growing around small-hydropower project development and deployment, with Riverbox as our core technology.
          </p>
          <div className="mt-10"><RevenueStreams /></div>
        </div>
      </section>

      {/* CTAs */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SupportAndInvest s={s} />
      </section>
    </>
  );
}
