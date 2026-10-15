import type { Metadata } from "next";
import Photo from "@/components/Photo";
import { CtaBand, PageHero, SectionTitle } from "@/components/ui";
import { INNOVATIONS, TECH_SPECS } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Riverbox",
  description: "Riverbox is a locally manufactured crossflow (Banki-Michell) micro-hydro turbine for low-head streams with 1–10 metres of head.",
};


const COMPARE = [
  { label: "Riverbox", points: ["Small intake, minimal civil works", "Faster to install", "Maintained locally", "Runs day and night"] },
  { label: "Diesel generator", points: ["Ongoing fuel cost", "Fuel must be transported in", "Noise and emissions", "Runs only when fuelled"] },
  { label: "Large hydro", points: ["Large dam and civil works", "Years to build", "High capital cost", "Requires grid extension"] },
];

export default function RiverboxPage() {
  return (
    <>
      <PageHero eyebrow="Technology" title="The Riverbox crossflow turbine"
        intro="An optimised, locally manufactured Banki-Michell crossflow turbine, engineered for the low-head, high-flow run-of-river conditions common in Zambian streams." />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionTitle eyebrow="How it works" title="From flowing water to a working mini-grid" />
            <ol className="mt-8 space-y-6">
              {[
                ["Intake", "A screened intake guides part of the stream's flow into the Riverbox while debris is kept out."],
                ["Crossflow runner", "Water passes twice through a wide, multi-blade runner, converting the energy of high-volume, low-head flow into rotation at around 300 RPM."],
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
          <div className="space-y-6">
          <Photo name="riverbox-prototype" alt="CAD render of the Riverbox crossflow turbine with casing" caption="Riverbox crossflow turbine — CAD model" />
          <div className="rounded-2xl border border-cream-200 bg-white p-8 shadow-sm">
            <h3 className="font-display text-xl font-semibold">Technical specifications</h3>
            <dl className="mt-6 divide-y divide-cream-200">
              {TECH_SPECS.map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
                  <dt className="text-sm font-semibold text-navy-800">{k}</dt>
                  <dd className="text-sm text-navy-700 sm:text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-xs text-navy-700/70">Efficiency validated by computational fluid dynamics (CFD). Pilot figures are being confirmed through field validation.</p>
          </div>
          </div>
        </div>
      </section>

      <section className="bg-cream-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="Key innovations" title="Engineered for Zambian rivers and workshops" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {INNOVATIONS.map((x) => (
              <div key={x.title} className="rounded-2xl border border-cream-200 bg-white p-7 shadow-sm">
                <div className="h-1 w-10 rounded bg-gold-500" />
                <h3 className="mt-4 font-display text-xl font-semibold">{x.title}</h3>
                <p className="mt-2 text-navy-700/85">{x.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6" aria-labelledby="validation-h">
        <SectionTitle eyebrow="Design & validation" title="Simulated, analysed and drawn for fabrication"
          intro="Riverbox has been modelled in CAD, its flow analysed with computational fluid dynamics (CFD), and its structure checked with finite element analysis (FEA)." />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Photo name="riverbox-turbine" alt="CAD render of the crossflow runner without casing" caption="Crossflow runner (casing removed) — CAD" />
          <Photo name="cfd-velocity" alt="CFD simulation of flow velocity through the turbine" caption="CFD — flow velocity streamlines" />
          <Photo name="cfd-pressure" alt="CFD simulation of pressure through the turbine" caption="CFD — pressure distribution" />
          <Photo name="fea-stress" alt="FEA von Mises stress analysis of the turbine" caption="FEA — von Mises stress" />
          <Photo name="fea-deformation" alt="FEA total deformation analysis of the turbine" caption="FEA — total deformation" />
          <Photo name="crossflow-drawing" alt="G5 crossflow turbine assembly drawing" caption="G5 crossflow turbine assembly drawing" />
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
