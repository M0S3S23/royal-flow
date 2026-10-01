"use client";

import { useState } from "react";

export default function NewsletterForm({ dark = true }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong.");
      setState("done");
      setMsg("Thank you — you'll hear from us when there's news.");
      setEmail("");
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex flex-col gap-2">
        <label htmlFor="nl-email" className="sr-only">Email address</label>
        <input id="nl-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address" className={`input flex-1 ${dark ? "!bg-white/10 !border-white/20 !text-white placeholder:text-white/50" : ""}`} />
        <button className="btn btn-gold" disabled={state === "loading"}>
          {state === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {msg && (
        <p role="status" className={`mt-2 text-sm ${state === "error" ? "text-red-300" : dark ? "text-water-300" : "text-water-700"}`}>{msg}</p>
      )}
    </form>
  );
}
