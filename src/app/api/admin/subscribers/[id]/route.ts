import { NextResponse } from "next/server";
import { apiAdmin } from "@/lib/auth";
import { notFound, oid, unauthorized } from "@/lib/api";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await apiAdmin())) return unauthorized();
  const _id = oid((await ctx.params).id);
  if (!_id) return notFound();
  const r = await (await getDb()).collection("subscribers").deleteOne({ _id });
  return r.deletedCount ? NextResponse.json({ ok: true }) : notFound();
}
