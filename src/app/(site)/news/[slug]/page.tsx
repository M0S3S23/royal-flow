import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import PostCard from "@/components/PostCard";
import RichText from "@/components/RichText";
import ShareButtons from "@/components/ShareButtons";
import { formatDate, siteUrl } from "@/lib/format";
import { getPublishedPostBySlug, getRelatedPosts, imageUrl } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedPostBySlug((await params).slug);
  if (!post) return { title: "Post not found" };
  const img = post.images[0] ? imageUrl(post.images[0]) : "/logo.png";
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.publishedAt ?? undefined, images: [img] },
    twitter: { card: post.images[0] ? "summary_large_image" : "summary", title: post.title, description: post.excerpt, images: [img] },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPublishedPostBySlug((await params).slug);
  if (!post) notFound();
  const related = await getRelatedPosts(post);
  const [cover, ...rest] = post.images.map(imageUrl);
  const url = `${siteUrl()}/news/${post.slug}`;

  return (
    <article>
      <header className="bg-navy-900 text-cream-100">
        <div className="mx-auto max-w-4xl px-4 pb-12 pt-12 sm:px-6">
          <Link href="/news" className="text-sm text-water-300 hover:text-white">← All news</Link>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <Link href={`/news?category=${encodeURIComponent(post.category)}`} className="rounded-full bg-gold-500 px-3 py-1 font-semibold text-navy-950">
              {post.category}
            </Link>
            <time dateTime={post.publishedAt ?? undefined} className="text-cream-100/70">{formatDate(post.publishedAt)}</time>
            <span className="text-cream-100/70">· {post.authorName}</span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-5xl">{post.title}</h1>
          {post.excerpt && <p className="mt-4 text-lg text-cream-100/80">{post.excerpt}</p>}
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={post.title} className="-mt-2 w-full rounded-b-2xl object-cover shadow-xl sm:max-h-[520px]" />
        )}
        <div className="py-12">
          <RichText content={post.content} />
        </div>

        {rest.length > 0 && (
          <section className="pb-12" aria-labelledby="gallery-h">
            <h2 id="gallery-h" className="mb-4 font-display text-2xl font-semibold">Photo gallery</h2>
            <Gallery images={post.images.map(imageUrl)} title={post.title} />
          </section>
        )}

        <div className="border-t border-cream-200 py-8">
          <ShareButtons url={url} title={post.title} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="bg-cream-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="font-display text-2xl font-bold">More from Royal Flow</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
