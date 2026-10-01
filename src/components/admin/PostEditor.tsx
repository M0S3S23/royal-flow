"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import RichText from "@/components/RichText";
import { imageUrl, POST_CATEGORIES, slugify, type Post, type PostCategory, type PostStatus } from "@/lib/post-shared";
import { CopyLinkButton, DeleteButton } from "./controls";

type Upload = { key: string; name: string; progress: "resizing" | "uploading" | "error"; error?: string };

const MAX_DIM = 2000;
const MAX_BYTES = 4 * 1024 * 1024;

/** Downscale large photos in the browser so uploads stay fast and under the size limit. */
async function prepareImage(file: File): Promise<Blob> {
  if (file.type === "image/gif") return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIM / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size <= MAX_BYTES && file.type !== "image/heic") {
      bmp.close();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close();
    const type = file.type === "image/png" ? "image/webp" : "image/jpeg";
    return await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("resize failed"))), type, 0.85));
  } catch {
    return file;
  }
}

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function PostEditor({ post }: { post?: Post }) {
  const router = useRouter();
  const isNew = !post;
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [category, setCategory] = useState<PostCategory>(post?.category ?? "News");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [images, setImages] = useState<string[]>(post?.images ?? []);
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "draft");
  const [publishedAt, setPublishedAt] = useState(toLocalInput(post?.publishedAt ?? null));
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // mark dirty on any change after first render
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setDirty(true);
  }, [title, slug, category, excerpt, content, images, status, publishedAt]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  /* ---------- images ---------- */
  async function addFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    for (const file of list) {
      const key = `${file.name}-${Math.random().toString(36).slice(2)}`;
      setUploads((u) => [...u, { key, name: file.name, progress: "resizing" }]);
      try {
        const blob = await prepareImage(file);
        if (blob.size > MAX_BYTES) throw new Error("Still larger than 4 MB after resizing.");
        setUploads((u) => u.map((x) => (x.key === key ? { ...x, progress: "uploading" } : x)));
        const fd = new FormData();
        fd.append("file", blob, file.name);
        const res = await fetch("/api/admin/uploads", { method: "POST", body: fd });
        const d = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(d.message || "Upload failed.");
        setImages((imgs) => [...imgs, d.id]);
        setUploads((u) => u.filter((x) => x.key !== key));
      } catch (e) {
        setUploads((u) => u.map((x) => (x.key === key ? { ...x, progress: "error", error: e instanceof Error ? e.message : "Upload failed." } : x)));
      }
    }
  }

  const move = (i: number, d: number) =>
    setImages((imgs) => {
      const j = i + d;
      if (j < 0 || j >= imgs.length) return imgs;
      const n = [...imgs];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  const makeCover = (i: number) => setImages((imgs) => [imgs[i], ...imgs.filter((_, k) => k !== i)]);
  const removeImg = (i: number) => setImages((imgs) => imgs.filter((_, k) => k !== i));

  /* ---------- content toolbar ---------- */
  function wrap(before: string, after = "", placeholder = "text") {
    const ta = textRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const sel = content.slice(s, e) || placeholder;
    const next = content.slice(0, s) + before + sel + after + content.slice(e);
    setContent(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(s + before.length, s + before.length + sel.length);
    });
  }
  function block(prefix: string, placeholder: string) {
    const ta = textRef.current;
    if (!ta) return;
    const s = ta.selectionStart;
    const needsGap = s > 0 && !content.slice(0, s).endsWith("\n\n");
    const ins = `${needsGap ? (content.slice(0, s).endsWith("\n") ? "\n" : "\n\n") : ""}${prefix}${placeholder}`;
    setContent(content.slice(0, s) + ins + content.slice(ta.selectionEnd));
    requestAnimationFrame(() => {
      ta.focus();
      const start = s + ins.length - placeholder.length;
      ta.setSelectionRange(start, start + placeholder.length);
    });
  }
  function insertImage(id: string) {
    setTab("write");
    const ta = textRef.current;
    const s = ta?.selectionStart ?? content.length;
    const md = `\n\n![Photo](${imageUrl(id)})\n\n`;
    setContent(content.slice(0, s) + md + content.slice(s));
  }

  /* ---------- save ---------- */
  async function save(nextStatus: PostStatus) {
    setSaving(true);
    setErrors({});
    setNotice(null);
    const body = {
      title, slug, category, excerpt, content, images, status: nextStatus,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
    };
    try {
      const res = await fetch(isNew ? "/api/admin/posts" : `/api/admin/posts/${post!.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(d.errors || {});
        setNotice({ kind: "err", text: d.message || "Save failed." });
        return;
      }
      setStatus(nextStatus);
      if (d.slug) setSlug(d.slug);
      setDirty(false);
      if (isNew) {
        router.replace(`/admin/posts/${d.id}?saved=1`);
        router.refresh();
        return;
      }
      setNotice({ kind: "ok", text: nextStatus === "published" ? "Published — the post is live." : "Saved as draft." });
      router.refresh();
    } catch {
      setNotice({ kind: "err", text: "Network error — your changes were not saved." });
    } finally {
      setSaving(false);
    }
  }

  const publicPath = `/news/${slug}`;
  const isLive = post?.status === "published" && status === "published";
  const busyUploads = uploads.some((u) => u.progress !== "error");

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* ---------- main column ---------- */}
      <div className="space-y-6">
        {notice && (
          <div role="status" className={`rounded-xl px-4 py-3 text-sm ${notice.kind === "ok" ? "bg-green-50 text-green-900 ring-1 ring-green-200" : "bg-red-50 text-red-900 ring-1 ring-red-200"}`}>
            {notice.text}
            {notice.kind === "ok" && status === "published" && (
              <> <a href={publicPath} target="_blank" className="font-semibold underline">View post ↗</a></>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-cream-200 bg-white p-6">
          <label htmlFor="title" className="label">Title *</label>
          <input id="title" className="input !text-lg font-semibold" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. First Riverbox prototype passes flow test" aria-invalid={!!errors.title || undefined} />
          {errors.title && <p className="mt-1 text-sm text-red-700">{errors.title}</p>}

          <label htmlFor="slug" className="label mt-4">Link (URL)</label>
          <div className="flex items-center overflow-hidden rounded-[.6rem] border border-[#d9cfbb] bg-cream-50 focus-within:border-gold-500">
            <span className="shrink-0 pl-3 text-sm text-navy-700/60">/news/</span>
            <input id="slug" className="w-full bg-transparent px-1 py-2.5 text-sm outline-none" value={slug}
              onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }} />
          </div>
          <p className="mt-1 text-xs text-navy-700/60">Auto-generated from the title. Changing it on a published post breaks previously shared links.</p>

          <label htmlFor="excerpt" className="label mt-4">Summary <span className="font-normal text-navy-700/60">(shown on cards & when shared; leave blank to auto-generate)</span></label>
          <textarea id="excerpt" className="input" rows={2} maxLength={400} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </div>

        {/* Images */}
        <div className="rounded-2xl border border-cream-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold">Pictures</h2>
            <p className="text-xs text-navy-700/60">First picture is the cover · JPEG, PNG, WebP, GIF · large photos are resized automatically</p>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
            className={`mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${dragOver ? "border-gold-500 bg-gold-500/5" : "border-cream-200"}`}>
            <p className="text-sm text-navy-700">Drag & drop pictures here, or</p>
            <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-navy btn-sm mt-2">Choose pictures</button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden
              onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }} />
          </div>

          {uploads.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm">
              {uploads.map((u) => (
                <li key={u.key} className="flex items-center justify-between gap-2 rounded-lg bg-cream-50 px-3 py-2">
                  <span className="truncate">{u.name}</span>
                  {u.progress === "error" ? (
                    <span className="flex items-center gap-2 text-red-700">{u.error}
                      <button type="button" className="underline" onClick={() => setUploads((x) => x.filter((y) => y.key !== u.key))}>dismiss</button>
                    </span>
                  ) : (
                    <span className="text-navy-700/70">{u.progress === "resizing" ? "Preparing…" : "Uploading…"}</span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {images.length > 0 && (
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((id, i) => (
                <li key={id} className={`overflow-hidden rounded-xl ring-2 ${i === 0 ? "ring-gold-500" : "ring-cream-200"}`}>
                  <div className="relative aspect-[4/3] bg-navy-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl(id)} alt={`Picture ${i + 1}`} className="h-full w-full object-cover" />
                    {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-gold-500 px-2 py-0.5 text-xs font-bold text-navy-950">Cover</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-1 bg-cream-50 p-1.5 text-xs">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="btn btn-ghost !px-2 !py-1" aria-label="Move left">←</button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="btn btn-ghost !px-2 !py-1" aria-label="Move right">→</button>
                    {i !== 0 && <button type="button" onClick={() => makeCover(i)} className="btn btn-ghost !px-2 !py-1">Cover</button>}
                    <button type="button" onClick={() => insertImage(id)} className="btn btn-ghost !px-2 !py-1" title="Insert into the post text">In text</button>
                    <button type="button" onClick={() => removeImg(i)} className="btn btn-ghost !px-2 !py-1 ml-auto text-red-700" aria-label="Remove picture">✕</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-cream-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold">Content</h2>
            <div className="flex rounded-full bg-cream-100 p-1 text-sm" role="tablist">
              {(["write", "preview"] as const).map((t) => (
                <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                  className={`rounded-full px-3 py-1 capitalize ${tab === t ? "bg-white font-semibold shadow-sm" : ""}`}>{t}</button>
              ))}
            </div>
          </div>

          {tab === "write" ? (
            <>
              <div className="mt-4 flex flex-wrap gap-1 rounded-t-lg border border-b-0 border-[#d9cfbb] bg-cream-50 p-1.5">
                {[
                  ["Heading", () => block("## ", "Heading")],
                  ["Bold", () => wrap("**", "**", "bold text")],
                  ["Italic", () => wrap("*", "*", "italic text")],
                  ["Link", () => wrap("[", "](https://)", "link text")],
                  ["List", () => block("- ", "List item")],
                  ["Quote", () => block("> ", "Quote")],
                ].map(([label, fn]) => (
                  <button key={label as string} type="button" onClick={fn as () => void} className="btn btn-ghost btn-sm !px-2.5">{label as string}</button>
                ))}
              </div>
              <textarea ref={textRef} id="content" className="input !rounded-t-none font-mono !text-sm" rows={18} value={content}
                onChange={(e) => setContent(e.target.value)} aria-label="Post content" aria-invalid={!!errors.content || undefined}
                placeholder={"Write your update here.\n\nLeave a blank line between paragraphs.\n## Use this for a heading\n- and this for a bullet list"} />
              {errors.content && <p className="mt-1 text-sm text-red-700">{errors.content}</p>}
            </>
          ) : (
            <div className="mt-4 min-h-64 rounded-lg border border-cream-200 p-6">
              {content.trim() ? <RichText content={content} /> : <p className="text-navy-700/60">Nothing to preview yet.</p>}
            </div>
          )}
        </div>
      </div>

      {/* ---------- sidebar ---------- */}
      <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-cream-200 bg-white p-5">
          <p className="text-sm">
            Status:{" "}
            <strong className={status === "published" ? "text-green-700" : "text-amber-700"}>{status === "published" ? "Published" : "Draft"}</strong>
            {dirty && <span className="ml-2 text-xs text-navy-700/60">· unsaved changes</span>}
          </p>

          <label htmlFor="category" className="label mt-4">Category</label>
          <select id="category" className="input" value={category} onChange={(e) => setCategory(e.target.value as PostCategory)}>
            {POST_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>

          <label htmlFor="publishedAt" className="label mt-4">Publish date</label>
          <input id="publishedAt" type="datetime-local" className="input" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
          <p className="mt-1 text-xs text-navy-700/60">Leave blank to use the moment you publish. A future date schedules the post.</p>
          {errors.publishedAt && <p className="mt-1 text-sm text-red-700">{errors.publishedAt}</p>}

          <div className="mt-5 grid gap-2">
            <button type="button" className="btn btn-gold" disabled={saving || busyUploads} onClick={() => save("published")}>
              {saving ? "Saving…" : status === "published" && !isNew ? "Update post" : "Publish"}
            </button>
            <button type="button" className="btn btn-outline text-navy-800" disabled={saving || busyUploads} onClick={() => save("draft")}>
              {status === "published" && !isNew ? "Unpublish (save as draft)" : "Save draft"}
            </button>
            {busyUploads && <p className="text-xs text-navy-700/70">Waiting for pictures to finish uploading…</p>}
          </div>
        </div>

        {!isNew && (
          <div className="rounded-2xl border border-cream-200 bg-white p-5">
            <h3 className="font-display font-semibold">Post link</h3>
            <p className="mt-2 break-all rounded-lg bg-cream-50 px-3 py-2 text-xs">{publicPath}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {isLive ? (
                <>
                  <a href={publicPath} target="_blank" className="btn btn-ghost btn-sm">Open ↗</a>
                  <CopyLinkButton url={publicPath} />
                </>
              ) : (
                <p className="text-xs text-navy-700/60">The link goes live once the post is published.</p>
              )}
            </div>
          </div>
        )}

        {!isNew && (
          <div className="rounded-2xl border border-red-200 bg-red-50/40 p-5">
            <h3 className="font-display font-semibold text-red-900">Delete post</h3>
            <p className="mt-1 text-xs text-red-900/70">Removes the post and all of its pictures. This can&apos;t be undone.</p>
            <div className="mt-3"><DeleteButton url={`/api/admin/posts/${post!.id}`} label="Delete this post" redirectTo="/admin/posts" confirmText="Are you sure?" /></div>
          </div>
        )}

        <Link href="/admin/posts" className="block text-center text-sm text-navy-700/70 hover:text-navy-900">← Back to all posts</Link>
      </aside>
    </div>
  );
}
