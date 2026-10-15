"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "M3 12l9-8 9 8M5 10v10h14V10" },
  { href: "/admin/posts", label: "Posts & updates", icon: "M4 5h16M4 10h16M4 15h10M4 20h7" },
  { href: "/admin/team", label: "Team members", icon: "M9 11a3 3 0 100-6 3 3 0 000 6zM17 11a3 3 0 100-6M3 20v-1a5 5 0 0110 0v1M15 20v-1a5 5 0 016-4.9" },
  { href: "/admin/messages", label: "Messages", icon: "M4 6h16v12H4zM4 6l8 7 8-7" },
  { href: "/admin/settings", label: "Site settings", icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19 12l2-1-2-4-2 1-2-2V4h-4v2L9 8 7 7 5 11l2 1v0l-2 1 2 4 2-1 2 2v2h4v-2l2-2 2 1 2-4z" },
  { href: "/admin/users", label: "Admin users", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zM6 21v-2a6 6 0 0112 0v2" },
];

export default function AdminNav({ newMessages }: { newMessages: number }) {
  const path = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Admin">
      {ITEMS.map((i) => {
        const on = i.href === "/admin" ? path === "/admin" : path.startsWith(i.href);
        return (
          <Link key={i.href} href={i.href} aria-current={on ? "page" : undefined}
            className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${on ? "bg-gold-500 text-navy-950" : "text-cream-100/80 hover:bg-white/10 hover:text-white"}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={i.icon} /></svg>
            <span>{i.label}</span>
            {i.href === "/admin/messages" && newMessages > 0 && (
              <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${on ? "bg-navy-900 text-white" : "bg-water-500 text-white"}`}>{newMessages}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
