import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { validateContact } from "@/lib/contact";

export const runtime = "nodejs";

// Simple in-memory rate limit: 5 submissions per IP per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many messages. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never fill the hidden "website" field.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const result = validateContact(body);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: "Please fix the highlighted fields.", errors: result.errors },
      { status: 422 }
    );
  }

  try {
    const db = await getDb();
    await db.collection("contact_messages").insertOne({
      ...result.data,
      status: "new",
      ip,
      userAgent: req.headers.get("user-agent") || undefined,
      createdAt: new Date(),
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[contact] failed to save message", err);
    return NextResponse.json(
      { ok: false, message: "We couldn't send your message right now. Please try again later." },
      { status: 500 }
    );
  }
}
