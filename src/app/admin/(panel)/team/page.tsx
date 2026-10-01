import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import TeamManager from "@/components/admin/TeamManager";
import { getTeam } from "@/lib/team";

export const metadata = { title: "Team" };

export default async function TeamAdmin() {
  const members = await getTeam({ includeHidden: true });
  return (
    <>
      <AdminHeader title="Team members" subtitle="People shown on the Team and About pages, with their roles."
        actions={<Link href="/team" target="_blank" className="btn btn-ghost">View Team page ↗</Link>} />
      <TeamManager members={members} />
    </>
  );
}
