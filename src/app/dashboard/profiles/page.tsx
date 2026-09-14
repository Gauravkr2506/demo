import type { Metadata } from "next";
import { ProfilesScreen } from "@/components/profiles-screen";

export const metadata: Metadata = { title: "My Profiles" };

export default function Page() {
  return <ProfilesScreen />;
}
