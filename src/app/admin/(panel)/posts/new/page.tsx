import AdminHeader from "@/components/admin/AdminHeader";
import PostEditor from "@/components/admin/PostEditor";

export const metadata = { title: "New post" };

export default function NewPost() {
  return (
    <>
      <AdminHeader title="New post" subtitle="Write an update, add pictures, then save as a draft or publish." />
      <PostEditor />
    </>
  );
}
