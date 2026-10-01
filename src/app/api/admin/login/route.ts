import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { readJson } from "@/lib/api";

export const runtime = "nodejs";

const attempts = new Map<string, { n: number; until: number }>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const now = Date.now();
  const a = attempts.get(ip);
  if (a && a.until > now && a.n >= 8) {
    return NextResponse.json({ message: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  const body = await readJson(req);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const db = await getDb();
  const user = email ? await db.collection("admin_users").findOne({ email }) : null;
  const ok = user ? await verifyPassword(password, user.passwordHash) : false;

  if (!user || !ok) {
    const cur = a && a.until > now ? a : { n: 0, until: now + 15 * 60 * 1000 };
    attempts.set(ip, { n: cur.n + 1, until: cur.until });
    return NextResponse.json({ message: "Incorrect email or password." }, { status: 401 });
  }

  attempts.delete(ip);
  await db.collection("admin_users").updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });
  await setSessionCookie({ uid: user._id.toString(), email: user.email, name: user.name || user.email });
  return NextResponse.json({ ok: true });
}
