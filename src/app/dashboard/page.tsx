import type { Metadata } from "next";
import { DashboardHome } from "@/components/dash-home";

export const metadata: Metadata = { title: "Dashboard" };

export default function Page() {
  return <DashboardHome />;
}
