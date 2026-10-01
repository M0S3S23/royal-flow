"use client";

import { useState } from "react";
import { INQUIRY_TYPES } from "@/lib/contact";

type Errors = Partial<Record<"name" | "email" | "phone" | "organization" | "inquiryType" | "message", string>>;

export default function ContactForm({ initialTopic }: { initialTopic?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverMsg, setServerMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    setErrors({});
    setServerMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(data.errors || {});
        setServerMsg(data.message || "Something went wrong. Please try again.");
        setState("error");
        return;
      }
      form.reset();
      setState("sent");
    } catch {
      setServerMsg("Network error. Please check your connection and try again.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-water-500/30 bg-water-500/10 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-water-500 text-2xl text-white">✓</div>
        <h3 className="mt-4 font-display text-2xl font-semibold">Message sent</h3>
        <p className="mt-2 text-navy-700">Thank you for reaching out. A member of the Royal Flow team will get back to you soon.</p>
        <button onClick={() => setState("idle")} className="btn btn-navy mt-6">Send another message</button>
      </div>
    );
  }

  const field = (name: keyof Errors) => ({
    id: name,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-err` : undefined,
    className: "input",
  });
  const Err = ({ name }: { name: keyof Errors }) =>
    errors[name] ? <p id={`${name}-err`} className="mt-1 text-sm text-red-700">{errors[name]}</p> : null;

  const topic = INQUIRY_TYPES.includes(initialTopic as never) ? initialTopic : INQUIRY_TYPES[0];

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="name" className="label">Full name *</label>
        <input {...field("name")} autoComplete="name" required />
        <Err name="name" />
      </div>
      <div>
        <label htmlFor="email" className="label">Email *</label>
        <input {...field("email")} type="email" autoComplete="email" required />
        <Err name="email" />
      </div>
      <div>
        <label htmlFor="phone" className="label">Phone <span className="font-normal text-navy-700/60">(optional)</span></label>
        <input {...field("phone")} type="tel" autoComplete="tel" placeholder="+260 …" />
        <Err name="phone" />
      </div>
      <div>
        <label htmlFor="organization" className="label">Organisation <span className="font-normal text-navy-700/60">(optional)</span></label>
        <input {...field("organization")} autoComplete="organization" />
        <Err name="organization" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="inquiryType" className="label">What is this about? *</label>
        <select {...field("inquiryType")} defaultValue={topic}>
          {INQUIRY_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <Err name="inquiryType" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className="label">Message *</label>
        <textarea {...field("message")} rows={6} required placeholder="Tell us how we can help…" />
        <Err name="message" />
      </div>

      {/* Honeypot — hidden from people, bots fill it in */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="sm:col-span-2 flex flex-col items-start gap-3">
        {serverMsg && <p role="alert" className="text-sm text-red-700">{serverMsg}</p>}
        <button type="submit" className="btn btn-gold" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className="text-xs text-navy-700/70">We only use your details to respond to your enquiry.</p>
      </div>
    </form>
  );
}
