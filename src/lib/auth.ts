import "server-only";
import { createHmac, randomBytes, scrypt as _scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

const scrypt = promisify(_scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;
export const SESSION_COOKIE = "rf_admin";
const SESSION_TTL_S = 60 * 60 * 8; // 8 hours

export interface AdminSession {
  uid: string;
  email: string;
  name: string;
  exp: number;
}

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set (32+ characters).");
  return s;
}

/* ---------- passwords ---------- */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, saltHex, keyHex] = stored.split("$");
  if (algo !== "scrypt" || !saltHex || !keyHex) return false;
  const key = await scrypt(password, Buffer.from(saltHex, "hex"), 64);
  const expected = Buffer.from(keyHex, "hex");
  return expected.length === key.length && timingSafeEqual(expected, key);
}

/* ---------- signed session token ---------- */
function sign(data: string) {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function createToken(s: Omit<AdminSession, "exp">): string {
  const payload: AdminSession = { ...s, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_S };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function readToken(token?: string): AdminSession | null {
  if (!token) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expected = Buffer.from(sign(data));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const s = JSON.parse(Buffer.from(data, "base64url").toString()) as AdminSession;
    return s.exp > Date.now() / 1000 ? s : null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(s: Omit<AdminSession, "exp">) {
  (await cookies()).set(SESSION_COOKIE, createToken(s), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_S,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Returns the session if valid AND the admin user still exists. */
export async function getSession(): Promise<AdminSession | null> {
  const s = readToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!s || !ObjectId.isValid(s.uid)) return null;
  const db = await getDb();
  const user = await db.collection("admin_users").findOne({ _id: new ObjectId(s.uid) }, { projection: { _id: 1 } });
  return user ? s : null;
}

/** For admin pages: redirects to login when not signed in. */
export async function requireAdmin(): Promise<AdminSession> {
  const s = await getSession();
  if (!s) redirect("/admin/login");
  return s;
}

/** For admin API routes: returns session or null (caller returns 401). */
export async function apiAdmin(): Promise<AdminSession | null> {
  try {
    return await getSession();
  } catch {
    return null;
  }
}
