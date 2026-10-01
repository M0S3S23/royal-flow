import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/format";
import { getPublishedPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const pages = ["", "/about", "/riverbox", "/progress", "/growth", "/support", "/team", "/news", "/contact"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  const { posts } = await getPublishedPosts({ perPage: 1000 });
  return [
    ...pages,
    ...posts.map((p) => ({ url: `${base}/news/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
