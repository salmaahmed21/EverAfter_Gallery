import type { Metadata } from "next";
import { AliNouranPageClient } from "@/components/AliNouranPageClient";

export const metadata: Metadata = {
  title: "Ali & Nouran | Ever After Gallery",
  description: "A little gatekeeping before the fun.",
};

export default function AliNouranPage() {
  return <AliNouranPageClient />;
}
