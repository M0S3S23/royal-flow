import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import PostEditor from "@/components/admin/PostEditor";
import { oid } from "@/lib/api";
import { getDb } from "@/lib/mongodb";
import { toPost } from "@/lib/posts";

export const metadata = { title: "Edit post" };

export default async function EditPost({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const _id = oid(id);
  if (!_id) notFound();
  const doc = await (await getDb()).collection("posts").findOne({ _id });
  if (!doc) notFound();
  const post = toPost(doc);
  return (
    <>
      <AdminHeader title="Edit post" subtitle={post.title} />
      {saved && (
        <div role="status" className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-900 ring-1 ring-green-200">
          Post created{post.status === "published" ? " and published" : " as a draft"}.
          {post.status === "published" && <> <a href={`/news/${post.slug}`} target="_blank" className="font-semibold underline">View post ↗</a></>}
        </div>
      )}
      <PostEditor post={post} />
    </>
  );
}
