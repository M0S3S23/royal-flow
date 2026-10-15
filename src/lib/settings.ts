import { getDb } from "./mongodb";

export interface Stat {
  value: string;
  label: string;
}

/** A verified funding/contribution channel (added later, only once verified). */
export interface FundingChannel {
  label: string;
  url: string;
  note: string;
}

export interface Partner {
  name: string;
  url: string;
}

export interface SiteSettings {
  stats: Stat[];
  contactEmail: string;
  phone: string;
  address: string;
  whatsapp: string;
  social: { facebook: string; linkedin: string; x: string; instagram: string };
  scaleUpTarget: number; // USD
  capitalCommitted: number; // USD, progress bar only shown when > 0
  /** Verified Royal Flow payment/donation link. Empty = "Support Riverbox" button stays inactive. */
  supportUrl: string;
  fundingChannels: FundingChannel[];
  partners: Partner[];
}

export const DEFAULT_SETTINGS: SiteSettings = {
  stats: [
    { value: "1–10 m", label: "Low-head water sources" },
    { value: "US$70k", label: "Scale-up capital target" },
    { value: "20+", label: "Rural communities targeted" },
    { value: "100+", label: "Installations — long-term goal" },
  ],
  contactEmail: "info@royalflowenergy.com",
  phone: "+260 000 000 000",
  address: "Lusaka, Zambia",
  whatsapp: "",
  social: { facebook: "", linkedin: "", x: "", instagram: "" },
  scaleUpTarget: 70000,
  capitalCommitted: 0,
  supportUrl: "",
  fundingChannels: [],
  partners: [],
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    const db = await getDb();
    const doc = await db.collection<{ _id: string } & Partial<SiteSettings>>("settings").findOne({ _id: "site" });
    if (!doc) return DEFAULT_SETTINGS;
    const { _id, ...rest } = doc;
    void _id;
    return {
      ...DEFAULT_SETTINGS,
      ...rest,
      social: { ...DEFAULT_SETTINGS.social, ...(rest.social || {}) },
      fundingChannels: Array.isArray(rest.fundingChannels) ? rest.fundingChannels : [],
      partners: Array.isArray(rest.partners) ? rest.partners : [],
    };
  } catch (e) {
    console.error("[settings] falling back to defaults", e);
    return DEFAULT_SETTINGS;
  }
}

export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
