"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function useSubmit(url: string, method: "POST" | "PATCH", okText: string) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true); setMsg(null); setErrors({});
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form).entries())) });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) { form.reset(); setMsg({ ok: true, text: okText }); router.refresh(); }
    else { setErrors(d.errors || {}); setMsg({ ok: false, text: d.message || "Something went wrong." }); }
  }
  return { busy, msg, errors, onSubmit };
}

export function AddUserForm() {
  const { busy, msg, errors, onSubmit } = useSubmit("/api/admin/users", "POST", "Admin added. Share the password with them securely.");
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div><label className="label" htmlFor="nu-name">Name</label><input id="nu-name" name="name" className="input" required />{errors.name && <p className="text-xs text-red-700">{errors.name}</p>}</div>
      <div><label className="label" htmlFor="nu-email">Email</label><input id="nu-email" name="email" type="email" className="input" required />{errors.email && <p className="text-xs text-red-700">{errors.email}</p>}</div>
      <div><label className="label" htmlFor="nu-pw">Temporary password</label><input id="nu-pw" name="password" type="password" minLength={10} className="input" required autoComplete="new-password" />{errors.password && <p className="text-xs text-red-700">{errors.password}</p>}</div>
      <button className="btn btn-navy" disabled={busy}>{busy ? "Adding…" : "Add admin"}</button>
      {msg && <p role="status" className={`text-sm ${msg.ok ? "text-green-700" : "text-red-700"}`}>{msg.text}</p>}
    </form>
  );
}

export function ChangePasswordForm() {
  const { busy, msg, errors, onSubmit } = useSubmit("/api/admin/users", "PATCH", "Password changed.");
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div><label className="label" htmlFor="cp-cur">Current password</label><input id="cp-cur" name="current" type="password" className="input" required autoComplete="current-password" />{errors.current && <p className="text-xs text-red-700">{errors.current}</p>}</div>
      <div><label className="label" htmlFor="cp-new">New password (10+ characters)</label><input id="cp-new" name="next" type="password" minLength={10} className="input" required autoComplete="new-password" />{errors.next && <p className="text-xs text-red-700">{errors.next}</p>}</div>
      <button className="btn btn-navy" disabled={busy}>{busy ? "Saving…" : "Change password"}</button>
      {msg && <p role="status" className={`text-sm ${msg.ok ? "text-green-700" : "text-red-700"}`}>{msg.text}</p>}
    </form>
  );
}
