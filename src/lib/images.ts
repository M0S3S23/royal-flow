import { ObjectId } from "mongodb";
import { getDb, getImageBucket } from "./mongodb";

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // stays under Vercel's 4.5 MB request limit

/** Detect image type from file signature (don't trust the browser-supplied MIME type). */
export function sniffImageType(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP") return "image/webp";
  if (buf.subarray(0, 3).toString() === "GIF") return "image/gif";
  return null;
}

export async function saveImage(buf: Buffer, filename: string, contentType: string, uploadedBy: string): Promise<string> {
  const bucket = await getImageBucket();
  const stream = bucket.openUploadStream(filename, {
    metadata: { contentType, uploadedBy, attached: false },
  });
  await new Promise<void>((resolve, reject) => {
    stream.once("finish", () => resolve());
    stream.once("error", reject);
    stream.end(buf);
  });
  return stream.id.toString();
}

export async function markImagesAttached(ids: string[], ownerId: ObjectId, ownerType: "post" | "team" = "post") {
  if (!ids.length) return;
  // GridFS has no update API; update the files collection directly.
  await (await getDb()).collection("images.files").updateMany(
    { _id: { $in: ids.map((i) => new ObjectId(i)) } },
    { $set: { "metadata.attached": true, "metadata.ownerType": ownerType, "metadata.ownerId": ownerId } }
  );
}

export async function deleteImages(ids: string[]) {
  const bucket = await getImageBucket();
  await Promise.all(
    ids.filter(ObjectId.isValid).map((i) => bucket.delete(new ObjectId(i)).catch(() => undefined))
  );
}

/** Remove uploads that were never attached to a saved post (older than 24h). */
export async function cleanupOrphanImages() {
  const bucket = await getImageBucket();
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const orphans = await bucket.find({ "metadata.attached": false, uploadDate: { $lt: cutoff } }).project({ _id: 1 }).toArray();
  await Promise.all(orphans.map((f) => bucket.delete(f._id).catch(() => undefined)));
}
