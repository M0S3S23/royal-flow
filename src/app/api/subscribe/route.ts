import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }
  if (typeof body.website === "string" && body.website) return NextResponse.json({ ok: true });
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
  if (!EMAIL_RE.test(email)) return NextResponse.json({ message: "Please enter a valid email address." }, { status: 422 });

  try {
    const db = await getDb();
    const source = body.source === "support-waitlist" ? "support-waitlist" : "newsletter";
    await db.collection("subscribers").updateOne(
      { email },
      { $setOnInsert: { email, createdAt: new Date() }, $addToSet: { sources: source } },
      { upsert: true }
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[subscribe]", e);
    return NextResponse.json({ message: "Couldn't subscribe right now. Please try again later." }, { status: 500 });
  }
}
