import { Suspense } from "react";
import type { Metadata } from "next";
import { ScanResolver } from "@/components/scan-resolver";

export const metadata: Metadata = { title: "Scanning…" };

export default async function ScanPage({ params }: PageProps<"/q/[slug]">) {
  const { slug } = await params;
  return (
    <Suspense>
      <ScanResolver code={slug} />
    </Suspense>
  );
}
