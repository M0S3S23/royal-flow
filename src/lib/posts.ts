import { ObjectId, type WithId, type Document } from "mongodb";
import { getDb } from "./mongodb";

import { POST_CATEGORIES, slugify, type Post, type PostCategory, type PostStatus } from "./post-shared";
export * from "./post-shared";

export function toPost(d: WithId<Document>): Post {
  const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : null);
  return {
    id: d._id.toString(),
    title: d.title ?? "",
    slug: d.slug ?? "",
    excerpt: d.excerpt ?? "",
    content: d.content ?? "",
    category: d.category ?? "News",
    images: Array.isArray(d.images) ? d.images.map(String) : [],
    status: d.status === "published" ? "published" : "draft",
    publishedAt: iso(d.publishedAt),
    createdAt: iso(d.createdAt) ?? new Date(0).toISOString(),
    updatedAt: iso(d.updatedAt) ?? new Date(0).toISOString(),
    authorName: d.authorName ?? "Royal Flow Team",
  };
}

/* ---------- public queries (never throw; site stays up if DB is down) ---------- */
const PUBLIC = { status: "published", publishedAt: { $lte: new Date() } };

export async function getPublishedPosts(opts: { page?: number; perPage?: number; category?: string } = {}) {
  const perPage = opts.perPage ?? 9;
  const page = Math.max(1, opts.page ?? 1);
  try {
    const db = await getDb();
    const filter: Document = { ...PUBLIC };
    if (opts.category && (POST_CATEGORIES as readonly string[]).includes(opts.category)) filter.category = opts.category;
    const [docs, total] = await Promise.all([
      db.collection("posts").find(filter).sort({ publishedAt: -1 }).skip((page - 1) * perPage).limit(perPage).toArray(),
      db.collection("posts").countDocuments(filter),
    ]);
    return { posts: docs.map(toPost), total, page, pages: Math.max(1, Math.ceil(total / perPage)) };
  } catch (e) {
    console.error("[posts] getPublishedPosts", e);
    return { posts: [] as Post[], total: 0, page, pages: 1 };
  }
}

export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  try {
    const db = await getDb();
    const d = await db.collection("posts").findOne({ ...PUBLIC, slug });
    return d ? toPost(d) : null;
  } catch (e) {
    console.error("[posts] getPublishedPostBySlug", e);
    return null;
  }
}

export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection("posts")
      .find({ ...PUBLIC, _id: { $ne: new ObjectId(post.id) } })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .toArray();
    return docs.map(toPost);
  } catch {
    return [];
  }
}

/* ---------- admin helpers ---------- */
export async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const db = await getDb();
  const root = slugify(base);
  let slug = root;
  for (let i = 2; ; i++) {
    const clash = await db.collection("posts").findOne(
      { slug, ...(excludeId ? { _id: { $ne: new ObjectId(excludeId) } } : {}) },
      { projection: { _id: 1 } }
    );
    if (!clash) return slug;
    slug = `${root}-${i}`;
  }
}

export interface PostInput {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: PostCategory;
  images: string[];
  status: PostStatus;
  publishedAt?: string | null;
}

export function validatePost(b: Record<string, unknown>):
  | { ok: true; data: PostInput }
  | { ok: false; errors: Record<string, string> } {
  const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const images = Array.isArray(b.images)
    ? b.images.filter((x): x is string => typeof x === "string" && ObjectId.isValid(x)).slice(0, 20)
    : [];
  const data: PostInput = {
    title: s(b.title, 200),
    slug: s(b.slug, 100) || undefined,
    excerpt: s(b.excerpt, 400),
    content: s(b.content, 50000),
    category: s(b.category, 40) as PostCategory,
    images,
    status: b.status === "published" ? "published" : "draft",
    publishedAt: s(b.publishedAt, 40) || null,
  };
  const errors: Record<string, string> = {};
  if (data.title.length < 3) errors.title = "Title must be at least 3 characters.";
  if (!POST_CATEGORIES.includes(data.category)) errors.category = "Choose a category.";
  if (data.status === "published" && data.content.length < 20) errors.content = "Published posts need some content (20+ characters).";
  if (data.publishedAt && isNaN(Date.parse(data.publishedAt))) errors.publishedAt = "Invalid date.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

/** Auto-generate an excerpt from content when none is given. */
export function autoExcerpt(content: string, max = 180): string {
  const plain = content
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > max ? plain.slice(0, max).replace(/\s+\S*$/, "") + "…" : plain;
}
