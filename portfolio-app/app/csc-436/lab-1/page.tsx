import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab 1 | CSC 436",
};

export default function Lab1Page() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <h1 className="text-lab-1-title leading-tight font-semibold tracking-tight">Lab 1</h1>
    </main>
  );
}
