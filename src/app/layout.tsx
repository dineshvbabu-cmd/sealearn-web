import type { Metadata } from "next";
import { Cinzel, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const cinzel = Cinzel({
  variable: "--font-cinzel-var",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-var",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SeaLearn Nigeria | NIMASA-Approved Maritime Training Institute",
  description:
    "Nigeria's premier maritime training institute. NIMASA approved, IMO/STCW 2010 compliant. Pre-Sea, BST, Deck, Engine, GMDSS and CoC programmes in Lagos.",
  keywords: "maritime training Nigeria, NIMASA, STCW, pre-sea cadet, Lagos",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${nunitoSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
