import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EXAMPLE_PROFILES, exampleBySlug } from "@/lib/demo-data";
import { typeMeta } from "@/lib/catalog";
import { ExampleDetail } from "@/components/example-detail";

export function generateStaticParams() {
  return EXAMPLE_PROFILES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/examples/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const profile = exampleBySlug(slug);
  if (!profile) return { title: "Example not found" };
  return {
    title: `${typeMeta(profile.type).label} Profile Example`,
    description: profile.bio,
  };
}

export default async function ExamplePage({ params }: PageProps<"/examples/[slug]">) {
  const { slug } = await params;
  const profile = exampleBySlug(slug);
  if (!profile) notFound();

  return <ExampleDetail profile={profile} />;
}
