"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { imageUrl } from "@/lib/post-shared";
import { initials, TEAM_GROUPS, type TeamGroup, type TeamMember } from "@/lib/team-shared";
import { DeleteButton } from "./controls";

type Draft = Omit<TeamMember, "id" | "order" | "photoUrl">;
const EMPTY: Draft = { name: "", role: "", group: "Leadership", bio: "", photo: null, email: "", linkedin: "", visible: true };
const PHOTO_SIZE = 600;

/** Centre-crop to a square and downscale, so every portrait looks consistent. */
async function squarePhoto(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const side = Math.min(bmp.width, bmp.height);
  const out = Math.min(PHOTO_SIZE, side);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = out;
  canvas.getContext("2d")!.drawImage(bmp, (bmp.width - side) / 2, (bmp.height - side) / 2, side, side, 0, 0, out, out);
  bmp.close();
  return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("Could not process photo."))), "image/jpeg", 0.88));
}

export function Avatar({ m, size = 56 }: { m: Pick<TeamMember, "name" | "photo"> & { photoUrl?: string | null }; size?: number }) {
  const src = m.photo ? imageUrl(m.photo) : m.photoUrl;
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" width={size} height={size} className="shrink-0 rounded-full object-cover ring-2 ring-gold-500/40" style={{ width: size, height: size }} />
  ) : (
    <span className="flex shrink-0 items-center justify-center rounded-full bg-navy-800 font-display font-bold text-gold-400" style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {initials(m.name) || "?"}
    </span>
  );
}

function MemberForm({ initial, id, fallbackUrl, onDone }: { initial: Draft; id?: string; fallbackUrl?: string | null; onDone: () => void }) {
  const router = useRouter();
  const [d, setD] = useState<Draft>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));

  async function upload(file: File) {
    setUploading(true);
    setMsg("");
    try {
      const blob = await squarePhoto(file);
      const fd = new FormData();
      fd.append("file", blob, file.name.replace(/\.\w+$/, "") + ".jpg");
      const res = await fetch("/api/admin/uploads", { method: "POST", body: fd });
      const r = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(r.message || "Upload failed.");
      set("photo", r.id);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setMsg("");
    const res = await fetch(id ? `/api/admin/team/${id}` : "/api/admin/team", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(d),
    });
    const r = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setErrors(r.errors || {});
      setMsg(r.message || "Save failed.");
      return;
    }
    router.refresh();
    onDone();
  }

  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-red-700">{errors[k]}</p>;
  const fid = (k: string) => `${id ?? "new"}-${k}`;

  return (
    <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
      <div className="flex items-center gap-4 sm:col-span-2">
        <Avatar m={{ name: d.name, photo: d.photo, photoUrl: d.photo ? null : fallbackUrl }} size={80} />
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-navy btn-sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? "Uploading…" : d.photo ? "Change photo" : "Upload photo"}
          </button>
          {d.photo && <button type="button" className="btn btn-ghost btn-sm text-red-700" onClick={() => set("photo", null)}>Remove photo</button>}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden
            onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
          <p className="w-full text-xs text-navy-700/60">Square head-and-shoulders photos work best; we crop to a square automatically.</p>
        </div>
      </div>

      <div>
        <label className="label" htmlFor={fid("name")}>Full name *</label>
        <input id={fid("name")} className="input" value={d.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name || undefined} />
        {err("name")}
      </div>
      <div>
        <label className="label" htmlFor={fid("role")}>Role / job title *</label>
        <input id={fid("role")} className="input" placeholder="e.g. IT & Software Lead" value={d.role} onChange={(e) => set("role", e.target.value)} aria-invalid={!!errors.role || undefined} />
        {err("role")}
      </div>
      <div>
        <label className="label" htmlFor={fid("group")}>Team section</label>
        <select id={fid("group")} className="input" value={d.group} onChange={(e) => set("group", e.target.value as TeamGroup)}>
          {TEAM_GROUPS.map((g) => <option key={g}>{g}</option>)}
        </select>
        {err("group")}
      </div>
      <div className="flex items-end">
        <label className="flex cursor-pointer items-center gap-2 pb-3 text-sm">
          <input type="checkbox" checked={d.visible} onChange={(e) => set("visible", e.target.checked)} className="h-4 w-4 accent-[var(--color-gold-500)]" />
          Show on the website
        </label>
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor={fid("bio")}>Short bio <span className="font-normal text-navy-700/60">(optional, 1–3 sentences)</span></label>
        <textarea id={fid("bio")} className="input" rows={3} maxLength={1200} value={d.bio} onChange={(e) => set("bio", e.target.value)} />
      </div>
      <div>
        <label className="label" htmlFor={fid("email")}>Public email <span className="font-normal text-navy-700/60">(optional)</span></label>
        <input id={fid("email")} type="email" className="input" value={d.email} onChange={(e) => set("email", e.target.value)} />
        {err("email")}
      </div>
      <div>
        <label className="label" htmlFor={fid("linkedin")}>LinkedIn <span className="font-normal text-navy-700/60">(optional)</span></label>
        <input id={fid("linkedin")} className="input" placeholder="https://www.linkedin.com/in/…" value={d.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
        {err("linkedin")}
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
        <button className="btn btn-gold" disabled={busy || uploading}>{busy ? "Saving…" : id ? "Save changes" : "Add team member"}</button>
        <button type="button" className="btn btn-ghost" onClick={onDone}>Cancel</button>
        {msg && <p role="alert" className="text-sm text-red-700">{msg}</p>}
      </div>
    </form>
  );
}

export default function TeamManager({ members }: { members: TeamMember[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | "new" | null>(members.length === 0 ? "new" : null);
  const [order, setOrder] = useState(members.map((m) => m.id));
  const [savingOrder, setSavingOrder] = useState(false);

  // keep local order in sync when the server list changes (add/delete)
  const ids = members.map((m) => m.id).join();
  const [syncedIds, setSyncedIds] = useState(ids);
  if (ids !== syncedIds) {
    setSyncedIds(ids);
    setOrder(members.map((m) => m.id));
  }

  const byId = new Map(members.map((m) => [m.id, m]));
  const list = order.map((id) => byId.get(id)).filter((m): m is TeamMember => !!m);

  async function move(i: number, d: number) {
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
    setSavingOrder(true);
    await fetch("/api/admin/team", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: next }) });
    setSavingOrder(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {editing === "new" ? (
        <section className="rounded-2xl border-2 border-gold-500/50 bg-white p-6">
          <h2 className="mb-5 font-display text-lg font-semibold">Add a team member</h2>
          <MemberForm initial={EMPTY} onDone={() => setEditing(null)} />
        </section>
      ) : (
        <button type="button" className="btn btn-gold" onClick={() => setEditing("new")}>+ Add team member</button>
      )}

      {list.length > 0 && (
        <section className="rounded-2xl border border-cream-200 bg-white">
          <div className="flex items-center justify-between border-b border-cream-200 px-5 py-3 text-sm text-navy-700/70">
            <span>{list.length} member{list.length === 1 ? "" : "s"} · use ↑ ↓ to set the order shown on the website</span>
            {savingOrder && <span>Saving order…</span>}
          </div>
          <ul className="divide-y divide-cream-200">
            {list.map((m, i) => (
              <li key={m.id} className="p-5">
                {editing === m.id ? (
                  <MemberForm id={m.id} initial={m} fallbackUrl={m.photoUrl} onDone={() => setEditing(null)} />
                ) : (
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-col">
                      <button type="button" className="btn btn-ghost !px-2 !py-0.5" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${m.name} up`}>↑</button>
                      <button type="button" className="btn btn-ghost !px-2 !py-0.5" disabled={i === list.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${m.name} down`}>↓</button>
                    </div>
                    <Avatar m={m} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">
                        {m.name}
                        {!m.visible && <span className="ml-2 rounded-full bg-cream-200 px-2 py-0.5 text-xs font-medium text-navy-700">Hidden</span>}
                      </p>
                      <p className="text-sm text-navy-700/80">{m.role}</p>
                      <p className="text-xs text-navy-700/55">{m.group}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" className="btn btn-navy btn-sm" onClick={() => setEditing(m.id)}>Edit</button>
                      <DeleteButton url={`/api/admin/team/${m.id}`} label="Remove" confirmText={`Remove ${m.name.split(" ")[0]}?`} />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
