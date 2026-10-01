import Link from "next/link";
import type { Document } from "mongodb";
import AdminHeader from "@/components/admin/AdminHeader";
import { CopyLinkButton, DeleteButton } from "@/components/admin/controls";
import { formatDate } from "@/lib/format";
import { getDb } from "@/lib/mongodb";
import { imageUrl, toPost } from "@/lib/posts";

export const metadata = { title: "Posts" };

export default async function PostsAdmin({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { status, q } = await searchParams;
  const filter: Document = {};
  if (status === "published" || status === "draft") filter.status = status;
  if (q) filter.title = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
  const posts = (await (await getDb()).collection("posts").find(filter).sort({ updatedAt: -1 }).limit(200).toArray()).map(toPost);

  const tab = (s: string | undefined, label: string) => (
    <Link href={s ? `/admin/posts?status=${s}` : "/admin/posts"}
      className={`rounded-full px-3 py-1.5 text-sm font-medium ${status === s ? "bg-navy-800 text-white" : "bg-white ring-1 ring-cream-200 hover:ring-gold-500"}`}>{label}</Link>
  );

  return (
    <>
      <AdminHeader title="Posts & updates" subtitle="Create, edit, publish and delete news posts."
        actions={<Link href="/admin/posts/new" className="btn btn-gold">+ New post</Link>} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">{tab(undefined, "All")}{tab("published", "Published")}{tab("draft", "Drafts")}</div>
        <form className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Search titles…" className="input !w-56 !py-2" aria-label="Search posts" />
          <button className="btn btn-navy btn-sm">Search</button>
        </form>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cream-200 bg-white p-12 text-center">
          <p className="font-display text-lg">No posts found</p>
          <Link href="/admin/posts/new" className="btn btn-gold mt-4">Write a post</Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => {
            const live = p.status === "published" && p.publishedAt && new Date(p.publishedAt) <= new Date();
            const scheduled = p.status === "published" && !live;
            return (
              <li key={p.id} className="flex flex-col gap-4 rounded-2xl border border-cream-200 bg-white p-4 sm:flex-row sm:items-center">
                <div className="h-20 w-full shrink-0 overflow-hidden rounded-lg bg-navy-800 sm:w-32">
                  {p.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl(p.images[0])} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-cream-100/50">No image</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`rounded-full px-2 py-0.5 font-semibold ${live ? "bg-green-100 text-green-800" : scheduled ? "bg-water-500/15 text-water-700" : "bg-amber-100 text-amber-800"}`}>
                      {live ? "Published" : scheduled ? "Scheduled" : "Draft"}
                    </span>
                    <span className="text-navy-700/70">{p.category}</span>
                    <span className="text-navy-700/50">· {p.images.length} image{p.images.length === 1 ? "" : "s"}</span>
                    <span className="text-navy-700/50">· {live || scheduled ? formatDate(p.publishedAt) : `edited ${formatDate(p.updatedAt)}`}</span>
                  </div>
                  <Link href={`/admin/posts/${p.id}`} className="mt-1 block truncate font-display text-lg font-semibold hover:text-gold-600">{p.title}</Link>
                  <p className="truncate text-xs text-navy-700/60">/news/{p.slug}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <Link href={`/admin/posts/${p.id}`} className="btn btn-navy btn-sm">Edit</Link>
                  {live && <a href={`/news/${p.slug}`} target="_blank" className="btn btn-ghost btn-sm">View ↗</a>}
                  {live && <CopyLinkButton url={`/news/${p.slug}`} />}
                  <DeleteButton url={`/api/admin/posts/${p.id}`} confirmText="Delete post and its images?" />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
