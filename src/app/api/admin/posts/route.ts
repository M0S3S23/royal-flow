import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { apiAdmin } from "@/lib/auth";
import { bad, readJson, unauthorized } from "@/lib/api";
import { getDb } from "@/lib/mongodb";
import { autoExcerpt, uniqueSlug, validatePost } from "@/lib/posts";
import { markImagesAttached } from "@/lib/images";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const s = await apiAdmin();
  if (!s) return unauthorized();
  const body = await readJson(req);
  if (!body) return bad("Invalid request.", undefined, 400);
  const v = validatePost(body);
  if (!v.ok) return bad("Please fix the highlighted fields.", v.errors);
  const d = v.data;

  const now = new Date();
  const slug = await uniqueSlug(d.slug || d.title);
  const publishedAt = d.status === "published" ? (d.publishedAt ? new Date(d.publishedAt) : now) : d.publishedAt ? new Date(d.publishedAt) : null;

  const db = await getDb();
  const res = await db.collection("posts").insertOne({
    title: d.title,
    slug,
    excerpt: d.excerpt || autoExcerpt(d.content),
    content: d.content,
    category: d.category,
    images: d.images.map((i) => new ObjectId(i)),
    status: d.status,
    publishedAt,
    authorName: s.name,
    authorId: new ObjectId(s.uid),
    createdAt: now,
    updatedAt: now,
  });
  await markImagesAttached(d.images, res.insertedId);
  return NextResponse.json({ ok: true, id: res.insertedId.toString(), slug }, { status: 201 });
}
