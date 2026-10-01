import Link from "next/link";
import { imageUrl, type Post } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export default function PostCard({ post }: { post: Post }) {
  const cover = post.images[0];
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/news/${post.slug}`} className="block aspect-[16/10] overflow-hidden bg-navy-800" tabIndex={-1} aria-hidden="true">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl(cover)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-navy-800 to-navy-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" className="h-24 w-24 opacity-80" />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-full bg-water-500/10 px-2.5 py-1 font-semibold text-water-700">{post.category}</span>
          <time dateTime={post.publishedAt ?? undefined} className="text-navy-700/70">{formatDate(post.publishedAt)}</time>
          {post.images.length > 1 && <span className="text-navy-700/70">· {post.images.length} photos</span>}
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-navy-900">
          <Link href={`/news/${post.slug}`} className="hover:text-gold-600">{post.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-navy-700/85">{post.excerpt}</p>
        <Link href={`/news/${post.slug}`} className="mt-4 text-sm font-semibold text-gold-600 hover:text-gold-500">
          Read more →
        </Link>
      </div>
    </article>
  );
}
