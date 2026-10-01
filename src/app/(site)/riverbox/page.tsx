import type { Metadata } from "next";
import { CtaBand, PageHero, SectionTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "The Riverbox",
  description: "The Riverbox is a low-head micro-hydro turbine designed for streams with 1–5 metres of head.",
};

const SPECS = [
  ["Water source", "Streams and rivers, low head"],
  ["Design head", "Approximately 1–5 metres"],
  ["Civil works", "Minimal — no large dam required"],
  ["Capacity", "Being validated at varying capacities and operating conditions"],
  ["Maintenance", "Designed for local technicians"],
  ["Operation", "Continuous, 24 hours a day when water flows"],
];

const COMPARE = [
  { label: "Riverbox", points: ["Small intake, minimal civil works", "Faster to install", "Maintained locally", "Runs day and night"] },
  { label: "Diesel generator", points: ["Ongoing fuel cost", "Fuel must be transported in", "Noise and emissions", "Runs only when fuelled"] },
  { label: "Large hydro", points: ["Large dam and civil works", "Years to build", "High capital cost", "Requires grid extension"] },
];

export default function RiverboxPage() {
  return (
    <>
      <PageHero eyebrow="Technology" title="The Riverbox micro-hydro turbine"
        intro="A compact, locally designed turbine that turns small streams into a steady source of electricity." />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionTitle eyebrow="How it works" title="From flowing water to a working mini-grid" />
            <ol className="mt-8 space-y-6">
              {[
                ["Intake", "A screened intake guides part of the stream's flow into the Riverbox while debris is kept out."],
                ["Turbine", "The low-head turbine converts the energy of moving water into rotation."],
                ["Generator & control", "A generator produces electricity; the controller keeps voltage and frequency stable."],
                ["Distribution", "Power is delivered to nearby homes and businesses through a small local network."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 font-bold text-navy-950">{i + 1}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{t}</h3>
                    <p className="mt-1 text-navy-700/85">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-cream-200 bg-white p-8 shadow-sm">
            <h3 className="font-display text-xl font-semibold">Key characteristics</h3>
            <dl className="mt-6 divide-y divide-cream-200">
              {SPECS.map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
                  <dt className="text-sm font-semibold text-navy-800">{k}</dt>
                  <dd className="text-sm text-navy-700 sm:text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-xs text-navy-700/70">Specifications are indicative and are being refined through field validation.</p>
          </div>
        </div>
      </section>

      <section className="bg-navy-800 py-20 text-cream-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold">Why micro-hydro?</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {COMPARE.map((c, i) => (
              <div key={c.label} className={`rounded-2xl p-7 ${i === 0 ? "bg-gold-500 text-navy-950" : "border border-white/10 bg-white/5"}`}>
                <h3 className="font-display text-xl font-bold">{c.label}</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  {c.points.map((p) => <li key={p}>• {p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionTitle eyebrow="What's next" title="A smart, monitored Riverbox"
          intro="Future units will report RPM, voltage, current, water flow and energy output to a monitoring dashboard, so our engineers can spot issues early and plan maintenance before faults occur." />
      </section>

      <CtaBand />
    </>
  );
}
