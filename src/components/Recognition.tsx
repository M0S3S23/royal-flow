import Photo from "./Photo";
import { RECOGNITION } from "@/lib/content";

export default function Recognition() {
  return (
    <section className="bg-navy-900 py-20 text-cream-100" aria-labelledby="recognition-h">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-water-300">Recognition</p>
          <h2 id="recognition-h" className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            <span className="gold-text">{RECOGNITION.award}</span>
          </h2>
          <p className="mt-4 text-lg text-cream-100/85">{RECOGNITION.event}</p>
          <p className="mt-2 text-cream-100/70">{RECOGNITION.note}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr] sm:items-end">
          <Photo name="award-munich" alt="Royal Flow Energy receiving the Jury Choice Award at the Global Sustainability Challenge finals in Munich" />
          <Photo name="award-pitch" alt="Presenting Riverbox at the Global Sustainability Challenge" />
        </div>
      </div>
    </section>
  );
}
