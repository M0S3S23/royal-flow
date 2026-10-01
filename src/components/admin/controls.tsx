"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Delete button with an inline "Are you sure?" step (no browser dialogs). */
export function DeleteButton({ url, label = "Delete", confirmText = "Delete permanently?", redirectTo, small = true }:
  { url: string; label?: string; confirmText?: string; redirectTo?: string; small?: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState<"idle" | "confirm" | "busy">("idle");
  const [err, setErr] = useState("");

  async function go() {
    setStep("busy");
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setErr(d.message || "Delete failed.");
      setStep("idle");
      return;
    }
    if (redirectTo) router.push(redirectTo);
    router.refresh();
  }

  const sz = small ? "btn-sm" : "";
  if (step === "idle")
    return (
      <span className="inline-flex items-center gap-2">
        <button type="button" onClick={() => { setErr(""); setStep("confirm"); }} className={`btn btn-ghost ${sz} text-red-700`}>{label}</button>
        {err && <span className="text-xs text-red-700">{err}</span>}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-xs text-red-800">{confirmText}</span>
      <button type="button" onClick={go} disabled={step === "busy"} className={`btn btn-danger ${sz}`}>{step === "busy" ? "…" : "Yes"}</button>
      <button type="button" onClick={() => setStep("idle")} className={`btn btn-ghost ${sz}`}>No</button>
    </span>
  );
}

export function CopyLinkButton({ url, label = "Copy link" }: { url: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className="btn btn-ghost btn-sm"
      onClick={async () => {
        const full = url.startsWith("http") ? url : `${window.location.origin}${url}`;
        try { await navigator.clipboard.writeText(full); } catch { /* ignore */ }
        setDone(true);
        setTimeout(() => setDone(false), 1800);
      }}>
      {done ? "Copied ✓" : label}
    </button>
  );
}

export function MessageStatus({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [val, setVal] = useState(status);
  return (
    <select aria-label="Message status" className="input !w-auto !py-1.5 !text-sm" value={val}
      onChange={async (e) => {
        const next = e.target.value;
        setVal(next);
        await fetch(`/api/admin/messages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
        router.refresh();
      }}>
      {["new", "read", "replied", "archived"].map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
    </select>
  );
}

/** Marks a message read the first time it is expanded. */
export function MarkReadOnOpen({ id, status, children, summary }: { id: string; status: string; children: React.ReactNode; summary: React.ReactNode }) {
  const router = useRouter();
  return (
    <details className="group" onToggle={async (e) => {
      if ((e.currentTarget as HTMLDetailsElement).open && status === "new") {
        await fetch(`/api/admin/messages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "read" }) });
        router.refresh();
      }
    }}>
      <summary className="cursor-pointer list-none">{summary}</summary>
      {children}
    </details>
  );
}

export function LogoutButton() {
  const router = useRouter();
  return (
    <button type="button" className="btn btn-ghost btn-sm w-full justify-start text-cream-100/80 hover:!bg-white/10 hover:text-white"
      onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); router.push("/admin/login"); router.refresh(); }}>
      Sign out
    </button>
  );
}
