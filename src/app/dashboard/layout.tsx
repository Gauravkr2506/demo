import type { Metadata } from "next";
import { DashShell } from "@/components/dash-shell";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · QRSPACE" },
};

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return <DashShell>{children}</DashShell>;
}
