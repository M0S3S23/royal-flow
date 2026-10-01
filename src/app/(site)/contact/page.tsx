import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { PageHero } from "@/components/ui";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with the Royal Flow Energy team about partnerships, investment, community sites or media.",
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const [{ topic }, s] = await Promise.all([searchParams, getSettings()]);
  const wa = s.whatsapp.replace(/[^\d]/g, "");

  return (
    <>
      <PageHero eyebrow="Contact us" title="Let's power communities together"
        intro="Investors, partners, communities, researchers and journalists — send us a message and the right person on our team will reply." />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_2fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl bg-navy-800 p-7 text-cream-100">
            <h2 className="font-display text-xl font-semibold text-gold-400">Reach us directly</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-cream-100/60">Email</dt>
                <dd><a href={`mailto:${s.contactEmail}`} className="font-medium hover:text-gold-300 break-all">{s.contactEmail}</a></dd>
              </div>
              {s.phone && (
                <div>
                  <dt className="text-cream-100/60">Phone</dt>
                  <dd><a href={`tel:${s.phone.replace(/\s/g, "")}`} className="font-medium hover:text-gold-300">{s.phone}</a></dd>
                </div>
              )}
              {s.address && (
                <div>
                  <dt className="text-cream-100/60">Location</dt>
                  <dd className="font-medium">{s.address}</dd>
                </div>
              )}
            </dl>
            {wa && (
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-sm mt-6">Chat on WhatsApp</a>
            )}
          </div>
          <div className="rounded-2xl border border-gold-500/40 bg-gold-500/5 p-7">
            <h2 className="font-display text-lg font-semibold">Investors & partners</h2>
            <p className="mt-2 text-sm text-navy-700/85">
              Choose <em>Investment / partnership</em> and tell us about your organisation and the kind of collaboration you have in mind.
            </p>
          </div>
          <div className="rounded-2xl border border-cream-200 bg-white p-7">
            <h2 className="font-display text-lg font-semibold">Have a stream near your community?</h2>
            <p className="mt-2 text-sm text-navy-700/85">
              Choose <em>Community / deployment site</em> and tell us where it is, roughly how many households live nearby, and whether the water flows all year.
            </p>
          </div>
        </aside>

        <div className="rounded-2xl border border-cream-200 bg-white p-6 shadow-sm sm:p-10">
          <h2 className="font-display text-2xl font-semibold">Send us a message</h2>
          <p className="mt-1 mb-8 text-sm text-navy-700/80">Fields marked * are required.</p>
          <ContactForm initialTopic={topic} />
        </div>
      </section>
    </>
  );
}
