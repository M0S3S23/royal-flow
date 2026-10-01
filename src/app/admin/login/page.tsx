import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  let signedIn = false;
  try { signedIn = !!(await getSession()); } catch { /* DB not configured yet */ }
  if (signedIn) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 px-4 [background:radial-gradient(60%_60%_at_80%_10%,#25446a_0%,#11253d_60%)]">
      <div className="w-full max-w-sm rounded-2xl bg-cream-50 p-8 shadow-2xl">
        <div className="text-center">
          <Image src="/logo.png" alt="Royal Flow Energy" width={88} height={88} className="mx-auto h-22 w-22" priority />
          <h1 className="mt-4 font-display text-2xl font-bold">Admin sign in</h1>
          <p className="mt-1 text-sm text-navy-700/70">Royal Flow Energy website</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
