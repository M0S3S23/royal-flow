import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import AdminNav from "@/components/admin/AdminNav";
import { LogoutButton } from "@/components/admin/controls";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const newMessages = await (await getDb()).collection("contact_messages").countDocuments({ status: "new" });

  return (
    <div className="lg:flex">
      <aside className="bg-navy-900 text-cream-100 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:overflow-y-auto">
        <div className="flex items-center justify-between gap-3 px-4 py-4 lg:block lg:px-5 lg:py-6">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={40} height={40} className="h-10 w-10" />
            <span>
              <span className="block font-brand text-sm font-bold gold-text">ROYAL FLOW</span>
              <span className="block text-[0.65rem] uppercase tracking-[0.25em] text-water-300">Admin</span>
            </span>
          </Link>
          <Link href="/" target="_blank" className="text-xs text-cream-100/70 hover:text-white lg:mt-4 lg:inline-block">View site ↗</Link>
        </div>
        <div className="px-3 pb-3 lg:px-3">
          <AdminNav newMessages={newMessages} />
        </div>
        <div className="hidden border-t border-white/10 px-5 py-4 lg:block">
          <p className="truncate text-sm font-medium">{session.name}</p>
          <p className="truncate text-xs text-cream-100/60">{session.email}</p>
          <div className="mt-2 -mx-2"><LogoutButton /></div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</div>
        <div className="border-t border-cream-200 px-4 py-4 lg:hidden"><LogoutButton /></div>
      </div>
    </div>
  );
}
