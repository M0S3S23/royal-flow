import { NextResponse } from "next/server";
import { apiAdmin } from "@/lib/auth";
import { bad, notFound, oid, unauthorized } from "@/lib/api";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const s = await apiAdmin();
  if (!s) return unauthorized();
  const { id } = await ctx.params;
  const _id = oid(id);
  if (!_id) return notFound();
  if (id === s.uid) return bad("You can't delete your own account.", undefined, 400);
  const db = await getDb();
  if ((await db.collection("admin_users").countDocuments()) <= 1) return bad("At least one admin must remain.", undefined, 400);
  const r = await db.collection("admin_users").deleteOne({ _id });
  return r.deletedCount ? NextResponse.json({ ok: true }) : notFound();
}
