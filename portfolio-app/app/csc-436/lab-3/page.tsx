import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab 3 | CSC 436",
};

export default function Lab3Page() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <h1 className="text-lab-3-title leading-tight font-semibold tracking-tight">Lab 3</h1>
    </main>
  );
}
