import type { Metadata } from "next";
import CrusadeSheet from "@/components/CrusadeSheet";
import PageBackground from "@/components/PageBackground";
import { placeholder_units, sample_units } from "@/data/crusade";

export const metadata: Metadata = {
  title: "Lab 4 | CSC 436",
};

export default function Lab4Page() {
  return (
    <main className="flex flex-1 flex-col">
      <PageBackground src="/backgrounds/wh40k-gamewatcher-Filip-Galekovic.jpg" />
      <CrusadeSheet units={sample_units} />
    </main>
  );
}
