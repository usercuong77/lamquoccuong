import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { LanguageProvider } from "@/components/providers/language-provider";
import { SkipLink } from "@/components/skip-link";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"]
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lamquoccuong.com"),
  title: "Lam Quoc Cuong | Premium Video Editor & Visual Brand Builder",
  description:
    "Video-first brand hub of Lam Quoc Cuong. Strategic video editing that strengthens brand perception, attraction, and trust.",
  openGraph: {
    title: "Lam Quoc Cuong",
    description:
      "Strategic video editing that elevates brand perception and attracts the right audience.",
    url: "https://lamquoccuong.com",
    siteName: "Lam Quoc Cuong",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Lam Quoc Cuong",
    description:
      "Strategic video editing that elevates brand perception and attracts the right audience."
  },
  alternates: {
    canonical: "https://lamquoccuong.com"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${sans.variable} ${serif.variable}`}>
        <LanguageProvider>
          <SkipLink />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
