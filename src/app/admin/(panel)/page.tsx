import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { getDb } from "@/lib/mongodb";
import { toPost } from "@/lib/posts";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const s = await requireAdmin();
  const db = await getDb();
  const [published, drafts, newMsgs, totalMsgs, recentPosts, recentMsgs] = await Promise.all([
    db.collection("posts").countDocuments({ status: "published" }),
    db.collection("posts").countDocuments({ status: "draft" }),
    db.collection("contact_messages").countDocuments({ status: "new" }),
    db.collection("contact_messages").countDocuments(),
    db.collection("posts").find().sort({ updatedAt: -1 }).limit(5).toArray(),
    db.collection("contact_messages").find().sort({ createdAt: -1 }).limit(5).toArray(),
  ]);

  const cards = [
    { label: "Published posts", value: published, href: "/admin/posts?status=published" },
    { label: "Drafts", value: drafts, href: "/admin/posts?status=draft" },
    { label: "New messages", value: newMsgs, sub: `${totalMsgs} total`, href: "/admin/messages?status=new" },
  ];

  return (
    <>
      <AdminHeader title={`Welcome, ${s.name.split(" ")[0]}`} subtitle="Here's what's happening on the Royal Flow website."
        actions={<Link href="/admin/posts/new" className="btn btn-gold">+ New post</Link>} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-2xl border border-cream-200 bg-white p-5 shadow-sm transition hover:border-gold-500">
            <p className="text-sm text-navy-700/75">{c.label}</p>
            <p className="mt-1 font-display text-3xl font-bold">{c.value}</p>
            {c.sub && <p className="text-xs text-navy-700/60">{c.sub}</p>}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-cream-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent posts</h2>
            <Link href="/admin/posts" className="text-sm font-semibold text-gold-600">All →</Link>
          </div>
          <ul className="mt-4 divide-y divide-cream-200">
            {recentPosts.length === 0 && <li className="py-3 text-sm text-navy-700/70">No posts yet. <Link href="/admin/posts/new" className="underline">Write the first one</Link>.</li>}
            {recentPosts.map(toPost).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <Link href={`/admin/posts/${p.id}`} className="min-w-0 truncate font-medium hover:text-gold-600">{p.title}</Link>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${p.status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{p.status}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-cream-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Latest messages</h2>
            <Link href="/admin/messages" className="text-sm font-semibold text-gold-600">All →</Link>
          </div>
          <ul className="mt-4 divide-y divide-cream-200">
            {recentMsgs.length === 0 && <li className="py-3 text-sm text-navy-700/70">No messages yet.</li>}
            {recentMsgs.map((m) => (
              <li key={m._id.toString()} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate font-medium">{m.name} <span className="font-normal text-navy-700/60">· {m.inquiryType}</span></p>
                  {m.status === "new" && <span className="h-2 w-2 shrink-0 rounded-full bg-water-500" aria-label="New" />}
                </div>
                <p className="truncate text-sm text-navy-700/75">{m.message}</p>
                <p className="text-xs text-navy-700/55">{formatDate(m.createdAt?.toISOString(), true)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
