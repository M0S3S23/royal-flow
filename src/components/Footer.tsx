import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { NAV } from "./nav";
import NewsletterForm from "./NewsletterForm";

export default async function Footer() {
  const s = await getSettings();
  const socials = [
    { key: "facebook", label: "Facebook", url: s.social.facebook },
    { key: "linkedin", label: "LinkedIn", url: s.social.linkedin },
    { key: "x", label: "X", url: s.social.x },
    { key: "instagram", label: "Instagram", url: s.social.instagram },
  ].filter((x) => x.url);

  return (
    <footer className="bg-navy-950 text-cream-100/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Royal Flow Energy logo" width={64} height={64} className="h-16 w-16" />
            <div>
              <p className="font-brand text-xl font-bold gold-text">ROYAL FLOW</p>
              <p className="text-xs uppercase tracking-[0.3em] text-water-300">Energy</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Clean, locally built micro-hydro power for communities beyond the grid.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-gold-400">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[...NAV, { href: "/support", label: "Support Riverbox" }].map((n) => (
              <li key={n.href}><Link href={n.href} className="hover:text-white">{n.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-gold-400">Get in touch</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href={`mailto:${s.contactEmail}`} className="hover:text-white break-all">{s.contactEmail}</a></li>
            {s.phone && <li><a href={`tel:${s.phone.replace(/\s/g, "")}`} className="hover:text-white">{s.phone}</a></li>}
            {s.address && <li>{s.address}</li>}
          </ul>
          {socials.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-3 text-sm">
              {socials.map((x) => (
                <li key={x.key}>
                  <a href={x.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/15 px-3 py-1 hover:border-gold-400 hover:text-gold-400">{x.label}</a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-gold-400">Stay updated</h3>
          <p className="mt-4 mb-3 text-sm">Pilot progress, field results and news — a few emails a year.</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Royal Flow Energy. All rights reserved.</p>
          <p>Made in Zambia · Powered by rivers</p>
        </div>
      </div>
    </footer>
  );
}
