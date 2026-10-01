import AdminHeader from "@/components/admin/AdminHeader";
import { DeleteButton } from "@/components/admin/controls";
import { formatDate } from "@/lib/format";
import { getDb } from "@/lib/mongodb";

export const metadata = { title: "Subscribers" };

export default async function Subscribers() {
  const subs = await (await getDb()).collection("subscribers").find().sort({ createdAt: -1 }).limit(2000).toArray();
  return (
    <>
      <AdminHeader title="Newsletter subscribers" subtitle={`${subs.length} people — newsletter sign-ups and people waiting for the Support Riverbox link.`}
        actions={subs.length > 0 && <a href="/api/admin/subscribers/export" className="btn btn-navy">Export CSV</a>} />
      {subs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cream-200 bg-white p-12 text-center text-navy-700/70">No subscribers yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-cream-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-cream-50 text-left text-xs uppercase tracking-wider text-navy-700/70">
              <tr><th className="px-4 py-3">Email</th><th className="px-4 py-3">Interested in</th><th className="px-4 py-3">Subscribed</th><th className="px-4 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {subs.map((s) => (
                <tr key={s._id.toString()}>
                  <td className="px-4 py-2.5"><a href={`mailto:${s.email}`} className="hover:underline">{s.email}</a></td>
                  <td className="px-4 py-2.5">
                    {(s.sources ?? ["newsletter"]).map((src: string) => (
                      <span key={src} className={`mr-1 rounded-full px-2 py-0.5 text-xs font-medium ${src === "support-waitlist" ? "bg-gold-500/20 text-gold-600" : "bg-water-500/10 text-water-700"}`}>
                        {src === "support-waitlist" ? "Support link" : "Newsletter"}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-2.5 text-navy-700/70">{formatDate(s.createdAt?.toISOString())}</td>
                  <td className="px-4 py-2.5 text-right"><DeleteButton url={`/api/admin/subscribers/${s._id}`} label="Remove" confirmText="Remove?" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
