import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { apiAdmin } from "@/lib/auth";
import { bad, readJson, unauthorized } from "@/lib/api";
import { getDb } from "@/lib/mongodb";
import { markImagesAttached } from "@/lib/images";
import { validateMember } from "@/lib/team";

export const runtime = "nodejs";

/** Add a team member (placed at the end of the list). */
export async function POST(req: Request) {
  if (!(await apiAdmin())) return unauthorized();
  const body = await readJson(req);
  if (!body) return bad("Invalid request.", undefined, 400);
  const v = validateMember(body);
  if (!v.ok) return bad("Please fix the highlighted fields.", v.errors);

  const db = await getDb();
  const last = await db.collection("team_members").find().sort({ order: -1 }).limit(1).next();
  const now = new Date();
  const res = await db.collection("team_members").insertOne({
    ...v.data,
    photo: v.data.photo ? new ObjectId(v.data.photo) : null,
    order: (last?.order ?? -1) + 1,
    createdAt: now,
    updatedAt: now,
  });
  if (v.data.photo) await markImagesAttached([v.data.photo], res.insertedId, "team");
  return NextResponse.json({ ok: true, id: res.insertedId.toString() }, { status: 201 });
}

/** Save a new display order: { ids: [...] } top to bottom. */
export async function PATCH(req: Request) {
  if (!(await apiAdmin())) return unauthorized();
  const body = await readJson(req);
  const ids = Array.isArray(body?.ids) ? body.ids.filter((x): x is string => typeof x === "string" && ObjectId.isValid(x)) : [];
  if (!ids.length) return bad("No order given.", undefined, 400);
  await (await getDb()).collection("team_members").bulkWrite(
    ids.map((id, i) => ({ updateOne: { filter: { _id: new ObjectId(id) }, update: { $set: { order: i } } } }))
  );
  return NextResponse.json({ ok: true });
}
