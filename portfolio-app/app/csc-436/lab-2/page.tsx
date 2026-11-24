import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab 2 | CSC 436",
};

export default function Lab2Page() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <h1 className="text-lab-2-title leading-tight font-semibold tracking-tight">Lab 2</h1>
    </main>
  );
}
