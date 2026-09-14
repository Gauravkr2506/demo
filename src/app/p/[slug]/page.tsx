import { Suspense } from "react";
import type { Metadata } from "next";
import { VisitorPage } from "@/components/visitor-page";
import { EXAMPLE_PROFILES, exampleBySlug } from "@/lib/demo-data";

export function generateStaticParams() {
  return EXAMPLE_PROFILES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/p/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const profile = exampleBySlug(slug);
  return {
    title: profile ? `${profile.name} · QRSPACE` : "Profile · QRSPACE",
    description: profile?.bio,
  };
}

export default async function PublicProfilePage({ params }: PageProps<"/p/[slug]">) {
  const { slug } = await params;
  return (
    <Suspense>
      <VisitorPage slug={slug} />
    </Suspense>
  );
}
