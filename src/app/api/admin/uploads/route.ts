import { NextResponse } from "next/server";
import { apiAdmin } from "@/lib/auth";
import { bad, unauthorized } from "@/lib/api";
import { cleanupOrphanImages, MAX_IMAGE_BYTES, saveImage, sniffImageType } from "@/lib/images";
import { imageUrl } from "@/lib/posts";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const s = await apiAdmin();
  if (!s) return unauthorized();

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return bad("Expected a file upload.", undefined, 400);
  }
  const file = form.get("file");
  if (!(file instanceof File)) return bad("No file received.", undefined, 400);
  if (file.size > MAX_IMAGE_BYTES) return bad("Image is larger than 4 MB.", undefined, 413);

  const buf = Buffer.from(await file.arrayBuffer());
  const type = sniffImageType(buf);
  if (!type) return bad("Only JPEG, PNG, WebP or GIF images are allowed.", undefined, 415);

  const id = await saveImage(buf, file.name.slice(0, 120) || "image", type, s.uid);
  cleanupOrphanImages().catch(() => undefined); // opportunistic housekeeping
  return NextResponse.json({ id, url: imageUrl(id) }, { status: 201 });
}
