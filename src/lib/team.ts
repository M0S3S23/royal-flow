import { existsSync } from "fs";
import path from "path";
import { ObjectId, type Document, type WithId } from "mongodb";
import { imageUrl, slugify } from "./post-shared";
import { getDb } from "./mongodb";
import { TEAM_GROUPS, type TeamGroup, type TeamMember } from "./team-shared";

export * from "./team-shared";

/** Photo saved in public/images/team/<name-slug>.jpg (e.g. moses-mwale.jpg). */
function staticPhoto(name: string): string | null {
  const file = `${slugify(name)}.jpg`;
  return existsSync(path.join(process.cwd(), "public", "images", "team", file)) ? `/images/team/${file}` : null;
}

export function toMember(d: WithId<Document>): TeamMember {
  const photo = d.photo ? String(d.photo) : null;
  return {
    photoUrl: photo ? imageUrl(photo) : staticPhoto(d.name ?? ""),
    id: d._id.toString(),
    name: d.name ?? "",
    role: d.role ?? "",
    group: (TEAM_GROUPS as readonly string[]).includes(d.group) ? d.group : "Leadership",
    bio: d.bio ?? "",
    photo: d.photo ? String(d.photo) : null,
    email: d.email ?? "",
    linkedin: d.linkedin ?? "",
    order: typeof d.order === "number" ? d.order : 0,
    visible: d.visible !== false,
  };
}

/** Founding team — inserted once into an empty collection. Photos are added later in the admin panel. */
const FOUNDING_TEAM: Array<Pick<TeamMember, "name" | "role" | "group" | "bio">> = [
  { name: "Emmanuel Kasengele", role: "Founder & Mechanical Engineering Lead", group: "Leadership",
    bio: "Leads company strategy, Riverbox mechanical design, prototype development, technical coordination, pilot development and partnerships." },
  { name: "Faith Mfune", role: "Legal & Community Engagement Lead", group: "Community & Partnerships",
    bio: "Supports legal and administrative matters, stakeholder coordination, community engagement and deployment-related communication." },
  { name: "Alexander Mushibwe", role: "Electrical Engineering Lead", group: "Engineering",
    bio: "Responsible for generator integration, electrical system development, control and protection requirements, testing and electrical commissioning support." },
  { name: "Malachi Bambala", role: "Marketing & Public Relations Lead", group: "Marketing & Communications",
    bio: "Responsible for brand communication, marketing materials, public relations, outreach and external visibility." },
  { name: "Moses Mwale", role: "IT & Digital Systems Lead", group: "IT & Software",
    bio: "Responsible for Royal Flow Energy's website, digital platforms, software-related systems and online technology infrastructure." },
];

const g = globalThis as unknown as { _teamSeeded?: Promise<void> };

/** Seeds the founding team once. A marker document stops it re-seeding if members are later removed. */
function seedOnce(): Promise<void> {
  if (!g._teamSeeded) {
    g._teamSeeded = (async () => {
      const db = await getDb();
      const marker = await db.collection<{ _id: string }>("settings").findOne({ _id: "seed:team" });
      if (marker) return;
      if ((await db.collection("team_members").countDocuments()) === 0) {
        const now = new Date();
        await db.collection("team_members").insertMany(
          FOUNDING_TEAM.map((m, i) => ({ ...m, photo: null, email: "", linkedin: "", visible: true, order: i, createdAt: now, updatedAt: now }))
        );
      }
      await db.collection<{ _id: string }>("settings").updateOne({ _id: "seed:team" }, { $set: { at: now() } }, { upsert: true });
    })().catch((e) => {
      g._teamSeeded = undefined;
      console.error("[team] seed failed", e);
    });
  }
  return g._teamSeeded;
}
const now = () => new Date();

/** Members in display order. Public callers get only visible members; never throws. */
export async function getTeam(opts: { includeHidden?: boolean } = {}): Promise<TeamMember[]> {
  try {
    await seedOnce();
    const db = await getDb();
    const docs = await db
      .collection("team_members")
      .find(opts.includeHidden ? {} : { visible: { $ne: false } })
      .sort({ order: 1, createdAt: 1 })
      .toArray();
    return docs.map(toMember);
  } catch (e) {
    if (opts.includeHidden) throw e;
    console.error("[team] getTeam", e);
    return [];
  }
}

export type MemberInput = Omit<TeamMember, "id" | "order" | "photoUrl">;

export function validateMember(b: Record<string, unknown>):
  | { ok: true; data: MemberInput }
  | { ok: false; errors: Record<string, string> } {
  const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const photo = typeof b.photo === "string" && ObjectId.isValid(b.photo) ? b.photo : null;
  const data: MemberInput = {
    name: s(b.name, 100),
    role: s(b.role, 100),
    group: s(b.group, 60) as TeamGroup,
    bio: s(b.bio, 1200),
    photo,
    email: s(b.email, 200).toLowerCase(),
    linkedin: s(b.linkedin, 300),
    visible: b.visible !== false,
  };
  const errors: Record<string, string> = {};
  if (data.name.length < 2) errors.name = "Enter the person's name.";
  if (data.role.length < 2) errors.role = "Enter their role or job title.";
  if (!TEAM_GROUPS.includes(data.group)) errors.group = "Choose a team section.";
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.email = "Enter a valid email or leave it blank.";
  if (data.linkedin && !/^https:\/\//i.test(data.linkedin)) errors.linkedin = "LinkedIn link must start with https://";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
