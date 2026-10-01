import Link from "next/link";
import type { Document } from "mongodb";
import AdminHeader from "@/components/admin/AdminHeader";
import { DeleteButton, MarkReadOnOpen, MessageStatus } from "@/components/admin/controls";
import { formatDate } from "@/lib/format";
import { getDb } from "@/lib/mongodb";

export const metadata = { title: "Messages" };
const STATUSES = ["new", "read", "replied", "archived"];

export default async function Messages({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const filter: Document = status && STATUSES.includes(status) ? { status } : { status: { $ne: "archived" } };
  const db = await getDb();
  const [msgs, counts] = await Promise.all([
    db.collection("contact_messages").find(filter).sort({ createdAt: -1 }).limit(300).toArray(),
    db.collection("contact_messages").aggregate<{ _id: string; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]).toArray(),
  ]);
  const c = Object.fromEntries(counts.map((x) => [x._id, x.n]));

  const tab = (s: string | undefined, label: string) => (
    <Link href={s ? `/admin/messages?status=${s}` : "/admin/messages"}
      className={`rounded-full px-3 py-1.5 text-sm font-medium ${status === s ? "bg-navy-800 text-white" : "bg-white ring-1 ring-cream-200 hover:ring-gold-500"}`}>
      {label}{s && c[s] ? ` (${c[s]})` : ""}
    </Link>
  );

  return (
    <>
      <AdminHeader title="Messages" subtitle="Enquiries sent through the Contact us page." />
      <div className="mb-5 flex flex-wrap gap-2">
        {tab(undefined, "Inbox")}{tab("new", "New")}{tab("read", "Read")}{tab("replied", "Replied")}{tab("archived", "Archived")}
      </div>

      {msgs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cream-200 bg-white p-12 text-center text-navy-700/70">No messages here.</div>
      ) : (
        <ul className="space-y-3">
          {msgs.map((m) => {
            const id = m._id.toString();
            const subject = encodeURIComponent(`Re: ${m.inquiryType} — Royal Flow Energy`);
            return (
              <li key={id} className={`rounded-2xl border bg-white p-4 ${m.status === "new" ? "border-water-500/50" : "border-cream-200"}`}>
                <MarkReadOnOpen id={id} status={m.status}
                  summary={
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold">
                          {m.status === "new" && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-water-500 align-middle" />}
                          {m.name} <span className="font-normal text-navy-700/60">&lt;{m.email}&gt;</span>
                        </p>
                        <p className="text-sm text-navy-700/80">
                          <span className="rounded bg-cream-100 px-1.5 py-0.5 text-xs font-medium">{m.inquiryType}</span>
                          {m.organization && <span className="ml-2">{m.organization}</span>}
                        </p>
                        <p className="mt-1 line-clamp-1 text-sm text-navy-700/70 group-open:hidden">{m.message}</p>
                      </div>
                      <span className="shrink-0 text-xs text-navy-700/60">{formatDate(m.createdAt?.toISOString(), true)}</span>
                    </div>
                  }>
                  <div className="mt-4 border-t border-cream-200 pt-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
                    {m.phone && <p className="mt-3 text-sm">Phone: <a href={`tel:${m.phone}`} className="underline">{m.phone}</a></p>}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <a href={`mailto:${m.email}?subject=${subject}`} className="btn btn-navy btn-sm">Reply by email</a>
                      <MessageStatus id={id} status={m.status} />
                      <DeleteButton url={`/api/admin/messages/${id}`} />
                    </div>
                  </div>
                </MarkReadOnOpen>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
