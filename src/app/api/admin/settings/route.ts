import { NextResponse } from "next/server";
import { apiAdmin } from "@/lib/auth";
import { bad, readJson, unauthorized } from "@/lib/api";
import { getDb } from "@/lib/mongodb";
import type { SiteSettings } from "@/lib/settings";

export const runtime = "nodejs";

export async function PUT(req: Request) {
  if (!(await apiAdmin())) return unauthorized();
  const b = await readJson(req);
  if (!b) return bad("Invalid request.", undefined, 400);
  const s = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const n = (v: unknown) => Math.max(0, Math.round(Number(v) || 0));
  const url = (v: unknown) => {
    const u = s(v, 300);
    return u === "" || /^https:\/\//i.test(u) ? u : null;
  };
  const list = (v: unknown, max: number) =>
    (Array.isArray(v) ? v.slice(0, max) : []).map((x) => (x && typeof x === "object" ? (x as Record<string, unknown>) : {}));
  const social = (b.social || {}) as Record<string, unknown>;
  const socials = { facebook: url(social.facebook), linkedin: url(social.linkedin), x: url(social.x), instagram: url(social.instagram) };
  if (Object.values(socials).some((v) => v === null)) return bad("Social links must start with https://");

  const stats = Array.isArray(b.stats)
    ? b.stats.slice(0, 8).map((x) => ({ value: s((x as Record<string, unknown>)?.value, 30), label: s((x as Record<string, unknown>)?.label, 60) })).filter((x) => x.value && x.label)
    : [];

  const doc: SiteSettings = {
    stats,
    contactEmail: s(b.contactEmail),
    phone: s(b.phone, 40),
    address: s(b.address),
    whatsapp: s(b.whatsapp, 30),
    social: socials as SiteSettings["social"],
    scaleUpTarget: n(b.scaleUpTarget),
    capitalCommitted: n(b.capitalCommitted),
    supportUrl: url(b.supportUrl) ?? "",
    fundingChannels: list(b.fundingChannels, 6).map((x) => ({ label: s(x.label, 60), url: url(x.url) ?? "", note: s(x.note, 200) })).filter((x) => x.label && x.url),
    partners: list(b.partners, 24).map((x) => ({ name: s(x.name, 80), url: url(x.url) ?? "" })).filter((x) => x.name),
  };
  if (s(b.supportUrl, 300) && !doc.supportUrl) return bad("The Support Riverbox payment link must start with https://");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(doc.contactEmail)) return bad("Enter a valid contact email.");

  await (await getDb()).collection<{ _id: string }>("settings").updateOne(
    { _id: "site" },
    { $set: { ...doc, updatedAt: new Date() } },
    { upsert: true }
  );
  return NextResponse.json({ ok: true });
}
