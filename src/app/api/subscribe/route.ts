import { NextResponse } from "next/server";

// Email subscriptions have been removed from the website.
export async function POST() {
  return NextResponse.json({ message: "Subscriptions are not available." }, { status: 410 });
}
