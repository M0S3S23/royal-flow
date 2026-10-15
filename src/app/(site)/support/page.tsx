import type { Metadata } from "next";
import { CapitalUses, FundingChannels, SupportAndInvest } from "@/components/growth";
import Photo from "@/components/Photo";
import { PageHero, SectionTitle } from "@/components/ui";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Support Riverbox",
  description: "Support the development and deployment of Riverbox, locally engineered micro-hydro technology from Zambia.",
};

export default async function SupportPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero eyebrow="Support Riverbox" title="Help bring locally engineered hydropower to more communities"
        intro="Contribute to Riverbox directly, or talk to us about investing or partnering." />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SupportAndInvest s={s} />
        <FundingChannels s={s} />

        <div className="mt-10 rounded-2xl border border-cream-200 bg-white p-6 sm:p-8">
          <h2 className="font-display text-lg font-semibold">How contributions are handled</h2>
          <p className="mt-2 text-navy-700/85">
            Contributions are received directly by Royal Flow Energy through a verified payment channel connected to the company —
            not through third parties receiving funds on our behalf. We only list funding channels that properly support a Zambia-based business.
          </p>
        </div>
      </section>

      <section className="bg-cream-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <SectionTitle eyebrow="Where support goes" title="Building capacity for commercial deployment" />
            <Photo name="community" alt="A rural community in Zambia" />
          </div>
          <div className="mt-10"><CapitalUses /></div>
        </div>
      </section>
    </>
  );
}
