import AdminHeader from "@/components/admin/AdminHeader";
import SettingsForm from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Site settings" };

export default async function SettingsPage() {
  return (
    <>
      <AdminHeader title="Site settings" subtitle="Contact details, the Support Riverbox payment link, funding channels, partners and impact figures." />
      <SettingsForm initial={await getSettings()} />
    </>
  );
}
