import AdminHeader from "@/components/admin/AdminHeader";
import { DeleteButton } from "@/components/admin/controls";
import { AddUserForm, ChangePasswordForm } from "@/components/admin/UserForms";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { getDb } from "@/lib/mongodb";

export const metadata = { title: "Admin users" };

export default async function UsersPage() {
  const me = await requireAdmin();
  const users = await (await getDb()).collection("admin_users").find({}, { projection: { passwordHash: 0 } }).sort({ createdAt: 1 }).toArray();
  const card = "rounded-2xl border border-cream-200 bg-white p-6";
  return (
    <>
      <AdminHeader title="Admin users" subtitle="People who can sign in and manage the website." />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className={card}>
          <h2 className="font-display text-lg font-semibold">Team members</h2>
          <ul className="mt-4 divide-y divide-cream-200">
            {users.map((u) => {
              const id = u._id.toString();
              return (
                <li key={id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div className="min-w-0">
                    <p className="font-medium">{u.name}{id === me.uid && <span className="ml-2 rounded-full bg-gold-500/20 px-2 py-0.5 text-xs text-gold-600">You</span>}</p>
                    <p className="truncate text-sm text-navy-700/70">{u.email}</p>
                    <p className="text-xs text-navy-700/50">Last sign-in: {formatDate(u.lastLoginAt?.toISOString(), true)}</p>
                  </div>
                  {id !== me.uid && users.length > 1 && <DeleteButton url={`/api/admin/users/${id}`} label="Remove" confirmText="Remove access?" />}
                </li>
              );
            })}
          </ul>
        </section>
        <div className="space-y-6">
          <section className={card}><h2 className="mb-4 font-display text-lg font-semibold">Add an admin</h2><AddUserForm /></section>
          <section className={card}><h2 className="mb-4 font-display text-lg font-semibold">Change your password</h2><ChangePasswordForm /></section>
        </div>
      </div>
    </>
  );
}
