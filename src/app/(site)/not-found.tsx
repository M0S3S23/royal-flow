import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-32 text-center">
      <p className="font-display text-7xl font-bold gold-text">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold">This page has drifted downstream</h1>
      <p className="mt-2 text-navy-700/80">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="btn btn-navy mt-8">Back to home</Link>
    </section>
  );
}
