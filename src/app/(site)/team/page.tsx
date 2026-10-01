import type { Metadata } from "next";
import Link from "next/link";
import TeamGrid from "@/components/TeamGrid";
import { CtaBand, PageHero, SectionTitle } from "@/components/ui";
import { INVEST_HREF, PARTNER_TYPES } from "@/lib/content";
import { getSettings } from "@/lib/settings";
import { getTeam } from "@/lib/team";

export const metadata: Metadata = {
  title: "Team & Partners",
  description: "Meet the Royal Flow Energy team and the partners helping bring Riverbox to communities across Zambia.",
};

export default async function TeamPage() {
  const [members, s] = await Promise.all([getTeam(), getSettings()]);
  return (
    <>
      <PageHero eyebrow="Team & partners" title="The people behind Riverbox"
        intro="Mechanical, electrical, legal, community, marketing and digital expertise working together to bring locally engineered hydropower to Zambia." />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {members.length > 0 ? (
          <TeamGrid members={members} grouped={members.length > 6} columns={members.length <= 6 ? 3 : 4} />
        ) : (
          <div className="rounded-2xl border border-dashed border-cream-200 bg-white p-12 text-center">
            <p className="font-display text-xl">Team profiles coming soon</p>
          </div>
        )}
      </section>

      <section id="partners" className="bg-cream-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="Partners" title="Working together to scale Riverbox"
            intro="Deploying Riverbox in 20+ rural communities depends on strong partnerships. We work with — and are looking for — organisations across the energy and development sector." />
          {s.partners.length > 0 && (
            <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {s.partners.map((p) => (
                <li key={p.name} className="flex items-center justify-center rounded-xl bg-white p-6 text-center font-display font-semibold ring-1 ring-cream-200">
                  {p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:text-gold-600">{p.name}</a> : p.name}
                </li>
              ))}
            </ul>
          )}
          <ul className="mt-10 flex flex-wrap gap-2">
            {PARTNER_TYPES.map((t) => (
              <li key={t} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-navy-800 ring-1 ring-cream-200">{t}</li>
            ))}
          </ul>
          <Link href={INVEST_HREF} className="btn btn-navy mt-8">Partner with us</Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
