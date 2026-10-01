import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { apiAdmin } from "@/lib/auth";
import { bad, notFound, oid, readJson, unauthorized } from "@/lib/api";
import { getDb } from "@/lib/mongodb";
import { deleteImages, markImagesAttached } from "@/lib/images";
import { validateMember } from "@/lib/team";

export const runtime = "nodejs";
type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  if (!(await apiAdmin())) return unauthorized();
  const _id = oid((await ctx.params).id);
  if (!_id) return notFound();
  const body = await readJson(req);
  if (!body) return bad("Invalid request.", undefined, 400);
  const v = validateMember(body);
  if (!v.ok) return bad("Please fix the highlighted fields.", v.errors);

  const db = await getDb();
  const existing = await db.collection("team_members").findOne({ _id });
  if (!existing) return notFound();

  await db.collection("team_members").updateOne(
    { _id },
    { $set: { ...v.data, photo: v.data.photo ? new ObjectId(v.data.photo) : null, updatedAt: new Date() } }
  );
  const oldPhoto = existing.photo ? String(existing.photo) : null;
  if (v.data.photo) await markImagesAttached([v.data.photo], _id, "team");
  if (oldPhoto && oldPhoto !== v.data.photo) await deleteImages([oldPhoto]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  if (!(await apiAdmin())) return unauthorized();
  const _id = oid((await ctx.params).id);
  if (!_id) return notFound();
  const doc = await (await getDb()).collection("team_members").findOneAndDelete({ _id });
  if (!doc) return notFound();
  if (doc.photo) await deleteImages([String(doc.photo)]);
  return NextResponse.json({ ok: true });
}
