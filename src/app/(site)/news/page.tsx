import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import { PageHero } from "@/components/ui";
import { getPublishedPosts, POST_CATEGORIES } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "News & Updates",
  description: "Project updates, pilot site news, events and press from Royal Flow Energy.",
};

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ page?: string; category?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const category = sp.category;
  const { posts, pages } = await getPublishedPosts({ page, category, perPage: 9 });

  const href = (p: number, c?: string) => {
    const q = new URLSearchParams();
    if (c) q.set("category", c);
    if (p > 1) q.set("page", String(p));
    const s = q.toString();
    return `/news${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHero eyebrow="News" title="News & updates" intro="Follow the Riverbox from workshop to riverbank." />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <nav aria-label="Filter by category" className="flex flex-wrap gap-2">
          {[undefined, ...POST_CATEGORIES].map((c) => {
            const on = (c ?? "") === (category ?? "");
            return (
              <Link key={c ?? "all"} href={href(1, c)} aria-current={on ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium ring-1 transition ${on ? "bg-navy-800 text-white ring-navy-800" : "bg-white text-navy-800 ring-cream-200 hover:ring-gold-500"}`}>
                {c ?? "All"}
              </Link>
            );
          })}
        </nav>

        {posts.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-cream-200 bg-white p-12 text-center">
            <p className="font-display text-xl">No posts yet</p>
            <p className="mt-2 text-navy-700/80">Check back soon — updates from the pilot are on the way.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}

        {pages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
            {page > 1 && <Link href={href(page - 1, category)} className="btn btn-ghost">← Newer</Link>}
            <span className="px-3 text-sm text-navy-700">Page {page} of {pages}</span>
            {page < pages && <Link href={href(page + 1, category)} className="btn btn-ghost">Older →</Link>}
          </nav>
        )}
      </section>
    </>
  );
}
