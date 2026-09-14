import { Suspense } from "react";
import type { Metadata } from "next";
import { CreateWizard } from "@/components/create-wizard";

export const metadata: Metadata = {
  title: "Create Your Profile",
  description: "Choose a profile type, add your information and buttons, customise it and save.",
};

export default function CreatePage() {
  return (
    <Suspense>
      <CreateWizard />
    </Suspense>
  );
}
