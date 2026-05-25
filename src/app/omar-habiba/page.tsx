import type { Metadata } from "next";
import { OmarHabibaPageClient } from "@/components/OmarHabibaPageClient";

export const metadata: Metadata = {
  title: "Omar & Habiba | Ever After Gallery",
  description: "A little gatekeeping before the fun.",
};

export default function OmarHabibaPage() {
  return <OmarHabibaPageClient />;
}
