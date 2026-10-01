import { NextResponse } from "next/server";
import { apiAdmin } from "@/lib/auth";
import { bad, notFound, oid, readJson, unauthorized } from "@/lib/api";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";
type Ctx = { params: Promise<{ id: string }> };
const STATUSES = ["new", "read", "replied", "archived"];

export async function PATCH(req: Request, ctx: Ctx) {
  if (!(await apiAdmin())) return unauthorized();
  const _id = oid((await ctx.params).id);
  if (!_id) return notFound();
  const body = await readJson(req);
  const status = typeof body?.status === "string" ? body.status : "";
  if (!STATUSES.includes(status)) return bad("Invalid status.");
  const r = await (await getDb()).collection("contact_messages").updateOne({ _id }, { $set: { status, updatedAt: new Date() } });
  return r.matchedCount ? NextResponse.json({ ok: true }) : notFound();
}

export async function DELETE(_req: Request, ctx: Ctx) {
  if (!(await apiAdmin())) return unauthorized();
  const _id = oid((await ctx.params).id);
  if (!_id) return notFound();
  const r = await (await getDb()).collection("contact_messages").deleteOne({ _id });
  return r.deletedCount ? NextResponse.json({ ok: true }) : notFound();
}
