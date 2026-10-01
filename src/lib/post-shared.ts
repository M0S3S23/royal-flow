/* Shared between server and client — no server-only imports here. */

export const POST_CATEGORIES = ["News", "Project Update", "Pilot Sites", "Events", "Press"] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];
export type PostStatus = "draft" | "published";

/** Serialisable post shape passed to components. */
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: PostCategory;
  images: string[]; // GridFS file ids; images[0] is the cover
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorName: string;
}

export function imageUrl(id: string) {
  return `/api/images/${id}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "post";
}

