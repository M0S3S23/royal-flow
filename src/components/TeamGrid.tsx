import { imageUrl } from "@/lib/post-shared";
import { initials, TEAM_GROUPS, type TeamMember } from "@/lib/team-shared";

function MemberCard({ m, compact = false }: { m: TeamMember; compact?: boolean }) {
  return (
    <article className="flex flex-col items-center rounded-2xl border border-cream-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {m.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl(m.photo)} alt={m.name} loading="lazy" className={`${compact ? "h-24 w-24" : "h-32 w-32"} rounded-full object-cover ring-4 ring-gold-500/30`} />
      ) : (
        <div aria-hidden="true" className={`flex ${compact ? "h-24 w-24 text-3xl" : "h-32 w-32 text-4xl"} items-center justify-center rounded-full bg-navy-800 font-display font-bold text-gold-400 ring-4 ring-gold-500/30`}>
          {initials(m.name)}
        </div>
      )}
      <h3 className="mt-5 font-display text-lg font-semibold text-navy-900">{m.name}</h3>
      <p className="mt-1 text-sm font-semibold text-gold-600">{m.role}</p>
      {m.bio && !compact && <p className="mt-3 text-sm leading-relaxed text-navy-700/85">{m.bio}</p>}
      {!compact && (m.email || m.linkedin) && (
        <div className="mt-auto flex gap-2 pt-5">
          {m.email && (
            <a href={`mailto:${m.email}`} className="rounded-full px-3 py-1 text-xs font-medium ring-1 ring-cream-200 hover:ring-gold-500" aria-label={`Email ${m.name}`}>Email</a>
          )}
          {m.linkedin && (
            <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-full px-3 py-1 text-xs font-medium ring-1 ring-cream-200 hover:ring-gold-500" aria-label={`${m.name} on LinkedIn`}>LinkedIn</a>
          )}
        </div>
      )}
    </article>
  );
}

/** Team members, grouped by section when `grouped` is set. */
export default function TeamGrid({ members, grouped = false, columns = 4, compact = false }:
  { members: TeamMember[]; grouped?: boolean; columns?: 3 | 4 | 5; compact?: boolean }) {
  // flex-wrap + fixed widths keeps an incomplete last row centred
  const w = { 3: "lg:w-[calc((100%-3rem)/3)]", 4: "lg:w-[calc((100%-4.5rem)/4)]", 5: "lg:w-[calc((100%-6rem)/5)]" }[columns];
  if (!grouped) {
    return (
      <div className="flex flex-wrap justify-center gap-6">
        {members.map((m) => (
          <div key={m.id} className={`flex w-full sm:w-[calc((100%-1.5rem)/2)] ${w} [&>article]:w-full`}>
            <MemberCard m={m} compact={compact} />
          </div>
        ))}
      </div>
    );
  }
  const groups = TEAM_GROUPS.map((g) => ({ g, list: members.filter((m) => m.group === g) })).filter((x) => x.list.length);
  return (
    <div className="space-y-16">
      {groups.map(({ g, list }) => (
        <section key={g} aria-labelledby={`team-${g}`}>
          <h2 id={`team-${g}`} className="mb-6 flex items-center gap-4 font-display text-2xl font-bold text-navy-900">
            {g}
            <span className="h-px flex-1 bg-cream-200" />
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((m) => <MemberCard key={m.id} m={m} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
