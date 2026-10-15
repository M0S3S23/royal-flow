/* Shared between server and client — no server-only imports here. */

export const TEAM_GROUPS = [
  "Leadership",
  "Engineering",
  "IT & Software",
  "Community & Partnerships",
  "Finance & Operations",
  "Marketing & Communications",
  "Advisors",
] as const;
export type TeamGroup = (typeof TEAM_GROUPS)[number];

export interface TeamMember {
  id: string;
  name: string;
  role: string; // job title, e.g. "IT & Software Lead"
  group: TeamGroup; // section on the Team page
  bio: string;
  photo: string | null; // GridFS image id (uploaded in admin)
  /** URL to show: uploaded photo, else public/images/team/<name-slug>.jpg if present, else null (initials). */
  photoUrl: string | null;
  email: string;
  linkedin: string;
  order: number;
  visible: boolean;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}
