"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "./nav";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={`sticky top-0 z-40 transition-all ${scrolled ? "bg-navy-900/95 shadow-lg backdrop-blur" : "bg-navy-900"}`}>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/" className="flex items-center gap-3" aria-label="Royal Flow Energy home">
          <Image src="/logo.png" alt="" width={52} height={52} priority className="h-12 w-12 drop-shadow" />
          <span className="leading-tight">
            <span className="block font-brand text-lg font-bold tracking-wider gold-text">ROYAL FLOW</span>
            <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-water-300">Energy</span>
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-0.5" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined}
              className={`rounded-full px-3 py-2 text-sm font-medium transition ${active(n.href) ? "text-gold-400" : "text-cream-100/85 hover:text-white"}`}>
              {n.label}
            </Link>
          ))}
          <Link href="/support" className="btn btn-gold btn-sm ml-3">Support Riverbox</Link>
        </nav>

        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-nav"
          className="xl:hidden rounded-lg p-2 text-cream-100 hover:bg-white/10" aria-label={open ? "Close menu" : "Open menu"}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="xl:hidden border-t border-white/10 bg-navy-900 px-4 pb-5 pt-2" aria-label="Mobile">
          {[{ href: "/", label: "Home" }, ...NAV].map((n) => (
            <Link key={n.href} href={n.href}
              className={`block rounded-lg px-3 py-3 text-base font-medium ${active(n.href) ? "text-gold-400" : "text-cream-100/90"}`}>
              {n.label}
            </Link>
          ))}
          <Link href="/support" className="btn btn-gold mt-3 w-full">Support Riverbox</Link>
        </nav>
      )}
    </header>
  );
}
