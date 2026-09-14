import type { Metadata } from "next";
import { HelpScreen } from "@/components/help-screen";

export const metadata: Metadata = { title: "Help & Support" };

export default function Page() {
  return <HelpScreen />;
}
