/**
 * Site photo. Files live in public/images/<name>.jpg — replace a placeholder
 * by saving the real photo under the same file name (landscape, ~1600×1000).
 */
export default function Photo({ name, alt, className = "", aspect = "aspect-[16/10]", caption }:
  { name: string; alt: string; className?: string; aspect?: string; caption?: string }) {
  return (
    <figure className={className}>
      <div className={`overflow-hidden rounded-2xl bg-navy-800 shadow-lg ring-1 ring-black/5 ${aspect}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/images/${name}.jpg`} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      </div>
      {caption && <figcaption className="mt-2 text-sm text-navy-700/70">{caption}</figcaption>}
    </figure>
  );
}
