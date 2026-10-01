import { NextResponse } from "next/server";
import { apiAdmin, hashPassword, verifyPassword } from "@/lib/auth";
import { bad, oid, readJson, unauthorized } from "@/lib/api";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

/** Add a new admin user. */
export async function POST(req: Request) {
  if (!(await apiAdmin())) return unauthorized();
  const b = await readJson(req);
  const name = typeof b?.name === "string" ? b.name.trim().slice(0, 80) : "";
  const email = typeof b?.email === "string" ? b.email.trim().toLowerCase().slice(0, 200) : "";
  const password = typeof b?.password === "string" ? b.password : "";
  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Enter a name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = "Enter a valid email.";
  if (password.length < 10) errors.password = "Password must be at least 10 characters.";
  if (Object.keys(errors).length) return bad("Please fix the highlighted fields.", errors);

  const db = await getDb();
  if (await db.collection("admin_users").findOne({ email })) return bad("An admin with that email already exists.", { email: "Already exists." });
  await db.collection("admin_users").insertOne({ name, email, passwordHash: await hashPassword(password), createdAt: new Date() });
  return NextResponse.json({ ok: true }, { status: 201 });
}

/** Change your own password. */
export async function PATCH(req: Request) {
  const s = await apiAdmin();
  if (!s) return unauthorized();
  const b = await readJson(req);
  const current = typeof b?.current === "string" ? b.current : "";
  const next = typeof b?.next === "string" ? b.next : "";
  if (next.length < 10) return bad("New password must be at least 10 characters.", { next: "At least 10 characters." });
  const db = await getDb();
  const user = await db.collection("admin_users").findOne({ _id: oid(s.uid)! });
  if (!user || !(await verifyPassword(current, user.passwordHash))) return bad("Current password is incorrect.", { current: "Incorrect." });
  await db.collection("admin_users").updateOne({ _id: user._id }, { $set: { passwordHash: await hashPassword(next), updatedAt: new Date() } });
  return NextResponse.json({ ok: true });
}
