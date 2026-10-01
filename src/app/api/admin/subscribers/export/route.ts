import { apiAdmin } from "@/lib/auth";
import { unauthorized } from "@/lib/api";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET() {
  if (!(await apiAdmin())) return unauthorized();
  const subs = await (await getDb()).collection("subscribers").find().sort({ createdAt: -1 }).toArray();
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const csv = ["email,interests,subscribed_at", ...subs.map((s) => `${esc(s.email)},${esc((s.sources ?? ["newsletter"]).join(" "))},${(s.createdAt as Date)?.toISOString() ?? ""}`)].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="royal-flow-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
