import { ObjectId } from "mongodb";
import { getImageBucket } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!ObjectId.isValid(id)) return new Response("Not found", { status: 404 });
  try {
    const bucket = await getImageBucket();
    const _id = new ObjectId(id);
    const file = await bucket.find({ _id }).next();
    if (!file) return new Response("Not found", { status: 404 });

    const chunks: Buffer[] = [];
    for await (const chunk of bucket.openDownloadStream(_id)) chunks.push(chunk as Buffer);
    const buf = Buffer.concat(chunks);

    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": (file.metadata?.contentType as string) || "image/jpeg",
        "Content-Length": String(buf.length),
        // Image ids are immutable — replacing an image creates a new id.
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (e) {
    console.error("[images]", e);
    return new Response("Error", { status: 500 });
  }
}
