import { redirect } from "next/navigation";

// The pilot page was replaced by /progress. (next.config.ts also redirects /pilot.)
export default function PilotRedirect() {
  redirect("/progress");
}
