import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/Photo";
import Recognition from "@/components/Recognition";
import { INSTITUTIONAL_PARTNER } from "@/lib/content";
import TeamGrid from "@/components/TeamGrid";
import { getTeam } from "@/lib/team";
import { CtaBand, PageHero, SectionTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description: "Royal Flow Energy is a Zambian clean-energy initiative developing affordable micro-hydro power for off-grid communities.",
};

const VALUES = [
  { title: "Local first", text: "Designed, built and maintained in Zambia, creating skills and jobs close to where the power is used." },
  { title: "Simple by design", text: "Fewer civil works and fewer moving parts mean lower cost and easier upkeep for communities." },
  { title: "Proven by data", text: "Every installation is measured, so decisions about the next one are based on real field results." },
  { title: "Built to scale", text: "A repeatable unit that can grow from three pilot sites to communities across Zambia and the region." },
];

const TEAM = [
  { role: "Engineering", text: "Turbine design, CFD and structural analysis, prototyping and field testing of the Riverbox." },
  { role: "IT & Software", text: "Digital infrastructure, this website, and the data and monitoring platform for deployed units." },
  { role: "Community & Partnerships", text: "Site selection, community engagement, and relationships with government, NGOs and funders." },
  { role: "Finance & Operations", text: "Fundraising, budgeting, procurement and logistics for the pilot deployments." },
];

export default async function AboutPage() {
  const members = await getTeam();
  const featured = members.slice(0, 5);
  return (
    <>
      <PageHero eyebrow="About Royal Flow" title="A Zambian engineering company harnessing local rivers"
        intro="Royal Flow Energy develops locally engineered small-hydropower systems, with Riverbox as our core technology." />

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div>
          <SectionTitle eyebrow="Who we are" title="Reliable, affordable power from low-head rivers" />
          <p className="mt-6 text-lg leading-relaxed text-navy-700/90">
            Conventional hydropower depends on large dams and major civil works. Royal Flow Energy takes a different approach:
            the <strong>Riverbox</strong>, a compact micro-hydro turbine designed for low-head streams of roughly 1–10 metres,
            that can be installed and maintained by local teams.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-navy-700/90">
            Riverbox began as a final-year engineering initiative at the {INSTITUTIONAL_PARTNER.name}, our institutional partner
            through the {INSTITUTIONAL_PARTNER.detail}. It directly supports Zambia&apos;s Rural Electrification Master Plan (REMP 2.0).
          </p>
          <p className="mt-4 text-lg leading-relaxed text-navy-700/90">
            We have moved beyond the concept stage. The Riverbox prototype has been developed, and we are now completing integration,
            testing and field validation — while preparing the manufacturing, engineering and project-delivery capacity needed for
            commercial deployment.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-navy-700/90">
            Our long-term vision is to become a Zambian engineering and renewable-energy deployment company, delivering small-hydropower
            projects from resource assessment through fabrication, installation and commissioning — in Zambia and across Southern Africa.
          </p>
        </div>
        <div className="space-y-6">
          <Photo name="team-at-work" alt="The Royal Flow Energy team on a community site visit" caption="Community site visit, April 2026" />
          <div className="grid gap-4 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-cream-200 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-navy-700/85">{v.text}</p>
            </div>
          ))}
          </div>
        </div>
      </section>

      <Recognition />

      <section className="bg-cream-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="Our team" title="A multidisciplinary team" intro="Royal Flow brings together engineering, software, community and finance expertise." />
          {featured.length > 0 ? (
            <>
              <div className="mt-10"><TeamGrid members={featured} columns={featured.length === 5 ? 5 : 4} compact /></div>
              <Link href="/team" className="mt-8 inline-block font-semibold text-gold-600 hover:text-gold-500">
                Meet the team & partners →
              </Link>
            </>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TEAM.map((t) => (
                <div key={t.role} className="rounded-2xl bg-white p-6 ring-1 ring-cream-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-800 font-display text-lg font-bold text-gold-400">
                    {t.role[0]}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{t.role}</h3>
                  <p className="mt-2 text-sm text-navy-700/85">{t.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
