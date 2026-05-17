import BottomNav from "@/component/layout/BottomNav";
import Footer from "@/component/layout/Footer";
import Navbar from "@/component/layout/Navbar";
import TopHeader from "@/component/layout/TopHeader";
import AOSProvider from "@/providers/AOSProvider";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "KataHira Learn",
  description: "Belajar Hiragana dan Katakana",
  icons: {
    icon: "/SakuraLearnIcon.webp",
    shortcut: "/SakuraLearnIcon.webp",
    apple: "/SakuraLearnIcon.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-secondary text-(--color-text-primary)">
        <AOSProvider />
        {/* Desktop Navbar */}
        <div className="hidden md:block">
          <Navbar />
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <TopHeader />
        </div>

        {/* Main Content */}
        <main className="flex-1 pt-24 pb-20 md:pb-0">{children}</main>

        {/* Footer */}
        <div className="hidden md:block">
          <Footer />
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
