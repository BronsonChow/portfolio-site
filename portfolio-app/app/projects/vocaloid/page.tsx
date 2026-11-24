import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vocaloid Stuff | Bronson Chow",
};

export default function VocaloidPage() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <h1 className="text-vocaloid-title leading-tight font-semibold tracking-tight">Vocaloid Stuff</h1>
    </main>
  );
}
