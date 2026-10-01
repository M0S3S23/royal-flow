"use client";

import { useState } from "react";

/** "Tell me when the Support Riverbox payment link opens." */
export default function NotifyForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "support-waitlist", website: "" }),
    });
    const d = await res.json().catch(() => ({}));
    if (res.ok) { setState("done"); setMsg("Thank you — we'll email you when contributions open."); setEmail(""); }
    else { setState("error"); setMsg(d.message || "Something went wrong."); }
  }

  if (state === "done") return <p role="status" className="text-sm font-semibold">{msg}</p>;
  return (
    <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
      <label htmlFor="notify-email" className="sr-only">Email address</label>
      <input id="notify-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="input flex-1 !border-navy-900/20" />
      <button className="btn btn-navy" disabled={state === "busy"}>{state === "busy" ? "…" : "Notify me"}</button>
      {state === "error" && <p role="alert" className="text-sm text-red-800 sm:basis-full">{msg}</p>}
    </form>
  );
}
