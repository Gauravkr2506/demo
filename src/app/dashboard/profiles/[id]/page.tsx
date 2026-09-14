import type { Metadata } from "next";
import { ProfileEditor } from "@/components/profile-editor";

export const metadata: Metadata = { title: "Edit profile" };

export default async function Page({ params }: PageProps<"/dashboard/profiles/[id]">) {
  const { id } = await params;
  return <ProfileEditor id={id} />;
}
