import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export const unauthorized = () => NextResponse.json({ message: "Not signed in." }, { status: 401 });
export const notFound = () => NextResponse.json({ message: "Not found." }, { status: 404 });
export const bad = (message: string, errors?: Record<string, string>, status = 422) =>
  NextResponse.json({ message, errors }, { status });

export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const b = await req.json();
    return b && typeof b === "object" ? (b as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function oid(id: string): ObjectId | null {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}
