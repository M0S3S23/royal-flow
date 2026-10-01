import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { apiAdmin } from "@/lib/auth";
import { bad, notFound, oid, readJson, unauthorized } from "@/lib/api";
import { getDb } from "@/lib/mongodb";
import { autoExcerpt, toPost, uniqueSlug, validatePost } from "@/lib/posts";
import { deleteImages, markImagesAttached } from "@/lib/images";

export const runtime = "nodejs";
type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  if (!(await apiAdmin())) return unauthorized();
  const _id = oid((await ctx.params).id);
  if (!_id) return notFound();
  const d = await (await getDb()).collection("posts").findOne({ _id });
  return d ? NextResponse.json(toPost(d)) : notFound();
}

export async function PUT(req: Request, ctx: Ctx) {
  if (!(await apiAdmin())) return unauthorized();
  const { id } = await ctx.params;
  const _id = oid(id);
  if (!_id) return notFound();
  const body = await readJson(req);
  if (!body) return bad("Invalid request.", undefined, 400);
  const v = validatePost(body);
  if (!v.ok) return bad("Please fix the highlighted fields.", v.errors);
  const d = v.data;

  const db = await getDb();
  const existing = await db.collection("posts").findOne({ _id });
  if (!existing) return notFound();

  const slug = d.slug && d.slug !== existing.slug ? await uniqueSlug(d.slug, id) : existing.slug;
  let publishedAt: Date | null = d.publishedAt ? new Date(d.publishedAt) : existing.publishedAt ?? null;
  if (d.status === "published" && !publishedAt) publishedAt = new Date();

  const oldImages: string[] = (existing.images || []).map(String);
  const removed = oldImages.filter((i) => !d.images.includes(i));

  await db.collection("posts").updateOne(
    { _id },
    {
      $set: {
        title: d.title,
        slug,
        excerpt: d.excerpt || autoExcerpt(d.content),
        content: d.content,
        category: d.category,
        images: d.images.map((i) => new ObjectId(i)),
        status: d.status,
        publishedAt,
        updatedAt: new Date(),
      },
    }
  );
  await markImagesAttached(d.images, _id);
  await deleteImages(removed);
  return NextResponse.json({ ok: true, slug });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  if (!(await apiAdmin())) return unauthorized();
  const _id = oid((await ctx.params).id);
  if (!_id) return notFound();
  const db = await getDb();
  const post = await db.collection("posts").findOneAndDelete({ _id });
  if (!post) return notFound();
  await deleteImages((post.images || []).map((i: ObjectId) => i.toString()));
  return NextResponse.json({ ok: true });
}
