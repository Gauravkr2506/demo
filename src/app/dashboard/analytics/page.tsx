import type { Metadata } from "next";
import { AnalyticsScreen } from "@/components/analytics-screen";

export const metadata: Metadata = { title: "Analytics" };

export default function Page() {
  return <AnalyticsScreen />;
}
