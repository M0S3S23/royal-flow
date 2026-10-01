"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteSettings, Stat } from "@/lib/settings";

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [s, setS] = useState<SiteSettings>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => setS((x) => ({ ...x, [k]: v }));
  const setStat = (i: number, k: keyof Stat, v: string) => set("stats", s.stats.map((st, j) => (j === i ? { ...st, [k]: v } : st)));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    setMsg(res.ok ? { ok: true, text: "Settings saved. The website is updated." } : { ok: false, text: d.message || "Save failed." });
    if (res.ok) router.refresh();
  }

  const card = "rounded-2xl border border-cream-200 bg-white p-6";
  return (
    <form onSubmit={save} className="space-y-6">
      <section className={card}>
        <h2 className="font-display text-lg font-semibold">Contact details</h2>
        <p className="text-sm text-navy-700/70">Shown on the Contact page and in the footer.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="ce">Contact email *</label><input id="ce" className="input" type="email" value={s.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} /></div>
          <div><label className="label" htmlFor="ph">Phone</label><input id="ph" className="input" value={s.phone} onChange={(e) => set("phone", e.target.value)} /></div>
          <div><label className="label" htmlFor="ad">Location / address</label><input id="ad" className="input" value={s.address} onChange={(e) => set("address", e.target.value)} /></div>
          <div><label className="label" htmlFor="wa">WhatsApp number</label><input id="wa" className="input" placeholder="+260…" value={s.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} /></div>
        </div>
      </section>

      <section className={card}>
        <h2 className="font-display text-lg font-semibold">Social media links</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(["facebook", "linkedin", "x", "instagram"] as const).map((k) => (
            <div key={k}>
              <label className="label capitalize" htmlFor={`so-${k}`}>{k === "x" ? "X (Twitter)" : k}</label>
              <input id={`so-${k}`} className="input" placeholder="https://…" value={s.social[k]} onChange={(e) => set("social", { ...s.social, [k]: e.target.value })} />
            </div>
          ))}
        </div>
      </section>

      <section className={card}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold">Support Riverbox payment link</h2>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${s.supportUrl.trim() ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
            {s.supportUrl.trim() ? "Button is LIVE" : "Button inactive (placeholder)"}
          </span>
        </div>
        <p className="mt-1 text-sm text-navy-700/70">
          Paste Royal Flow Energy&apos;s <strong>verified and tested</strong> payment/donation link here. While this is empty, the
          &quot;Support Riverbox&quot; button shows &quot;opening soon&quot; and visitors can only leave their email.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <input aria-label="Payment link" className="input flex-1" placeholder="https://… (leave empty until verified)" value={s.supportUrl}
            onChange={(e) => set("supportUrl", e.target.value)} />
          {s.supportUrl.trim() && <a href={s.supportUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Test link ↗</a>}
        </div>
      </section>

      <section className={card}>
        <h2 className="font-display text-lg font-semibold">Scale-up capital</h2>
        <p className="text-sm text-navy-700/70">Shown on the Home and Growth &amp; Investment pages (US$). The progress bar only appears once &quot;committed&quot; is above 0.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="st">Target</label><input id="st" className="input" type="number" min={0} value={s.scaleUpTarget} onChange={(e) => set("scaleUpTarget", Number(e.target.value))} /></div>
          <div><label className="label" htmlFor="cc">Committed so far</label><input id="cc" className="input" type="number" min={0} value={s.capitalCommitted} onChange={(e) => set("capitalCommitted", Number(e.target.value))} /></div>
        </div>
      </section>

      <section className={card}>
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-semibold">Other verified funding channels</h2>
            <p className="text-sm text-navy-700/70">Optional. Only add platforms that properly support a Zambian business. Shown on the Support page when added.</p>
          </div>
          {s.fundingChannels.length < 6 && (
            <button type="button" className="btn btn-ghost btn-sm shrink-0" onClick={() => set("fundingChannels", [...s.fundingChannels, { label: "", url: "", note: "" }])}>+ Add</button>
          )}
        </div>
        <ul className="mt-4 space-y-3">
          {s.fundingChannels.length === 0 && <li className="text-sm text-navy-700/60">None yet.</li>}
          {s.fundingChannels.map((c, i) => (
            <li key={i} className="grid gap-2 rounded-xl bg-cream-50 p-3 sm:grid-cols-[1fr_1.5fr_auto]">
              <input aria-label="Channel name" className="input" placeholder="Name" value={c.label}
                onChange={(e) => set("fundingChannels", s.fundingChannels.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
              <input aria-label="Channel link" className="input" placeholder="https://…" value={c.url}
                onChange={(e) => set("fundingChannels", s.fundingChannels.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} />
              <button type="button" className="btn btn-ghost btn-sm text-red-700" aria-label="Remove channel"
                onClick={() => set("fundingChannels", s.fundingChannels.filter((_, j) => j !== i))}>✕</button>
              <input aria-label="Channel note" className="input sm:col-span-3" placeholder="Short note (optional)" value={c.note}
                onChange={(e) => set("fundingChannels", s.fundingChannels.map((x, j) => (j === i ? { ...x, note: e.target.value } : x)))} />
            </li>
          ))}
        </ul>
      </section>

      <section className={card}>
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-semibold">Partners</h2>
            <p className="text-sm text-navy-700/70">Organisations shown in the Partners section of the Team page.</p>
          </div>
          {s.partners.length < 24 && (
            <button type="button" className="btn btn-ghost btn-sm shrink-0" onClick={() => set("partners", [...s.partners, { name: "", url: "" }])}>+ Add</button>
          )}
        </div>
        <ul className="mt-4 space-y-2">
          {s.partners.length === 0 && <li className="text-sm text-navy-700/60">None yet.</li>}
          {s.partners.map((p, i) => (
            <li key={i} className="flex flex-wrap gap-2">
              <input aria-label="Partner name" className="input flex-1" placeholder="Organisation name" value={p.name}
                onChange={(e) => set("partners", s.partners.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
              <input aria-label="Partner website" className="input flex-1" placeholder="https://… (optional)" value={p.url}
                onChange={(e) => set("partners", s.partners.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} />
              <button type="button" className="btn btn-ghost btn-sm text-red-700" aria-label="Remove partner"
                onClick={() => set("partners", s.partners.filter((_, j) => j !== i))}>✕</button>
            </li>
          ))}
        </ul>
      </section>

      <section className={card}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Impact figures</h2>
            <p className="text-sm text-navy-700/70">The number tiles on the Home and Progress pages. Update them as Riverbox progresses.</p>
          </div>
          {s.stats.length < 8 && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => set("stats", [...s.stats, { value: "", label: "" }])}>+ Add</button>
          )}
        </div>
        <ul className="mt-4 space-y-3">
          {s.stats.map((st, i) => (
            <li key={i} className="flex flex-wrap items-center gap-2">
              <input aria-label="Value" className="input !w-32" placeholder="e.g. 75" value={st.value} onChange={(e) => setStat(i, "value", e.target.value)} />
              <input aria-label="Label" className="input flex-1" placeholder="e.g. Households connected" value={st.label} onChange={(e) => setStat(i, "label", e.target.value)} />
              <button type="button" className="btn btn-ghost btn-sm text-red-700" onClick={() => set("stats", s.stats.filter((_, j) => j !== i))} aria-label="Remove figure">✕</button>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex items-center gap-4">
        <button className="btn btn-gold" disabled={busy}>{busy ? "Saving…" : "Save settings"}</button>
        {msg && <p role="status" className={`text-sm ${msg.ok ? "text-green-700" : "text-red-700"}`}>{msg.text}</p>}
      </div>
    </form>
  );
}
