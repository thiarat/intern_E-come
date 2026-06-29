import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

import Header from "../components/Header";

export const metadata: Metadata = {
  title: "Nexus Delivery | Premium Tech",
  description: "Next-gen ecommerce experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body suppressHydrationWarning>
        <Header />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
