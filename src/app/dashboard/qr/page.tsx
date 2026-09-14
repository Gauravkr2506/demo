import { Suspense } from "react";
import type { Metadata } from "next";
import { QRScreen } from "@/components/qr-screen";

export const metadata: Metadata = { title: "QR Code" };

export default function Page() {
  return (
    <Suspense>
      <QRScreen />
    </Suspense>
  );
}
