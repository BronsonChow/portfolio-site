import type { Metadata } from "next";
import { Noto_Sans, Cormorant_Garamond } from "next/font/google";
import "./styles/globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";

const noto_sans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});
const cormorant_garamond = Cormorant_Garamond({
  variable: "--font-cormorant_garamond",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bronson Chow's Site",
  description: "Personal portfolio of sorts",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${noto_sans.variable} ${cormorant_garamond.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
