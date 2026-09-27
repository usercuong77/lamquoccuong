import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { LanguageProvider } from "@/components/providers/language-provider";
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
  title: "Cuonglq | Video Editor, Motion Nerd & Professional Handsome Guy",
  description:
    "Personal playground of Lâm Quốc Cường: video editing, motion graphics, 3D, AI, creative experiments and questionable jokes.",
  openGraph: {
    title: "Cuonglq | Video Editor, Motion Nerd & Professional Handsome Guy",
    description:
      "Video editing, motion graphics, 3D, AI and a slightly dangerous amount of curiosity.",
    url: "https://lamquoccuong.com",
    siteName: "Lam Quoc Cuong",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Cuonglq - Video Editor, Motion Nerd and Professional Handsome Guy"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Cuonglq | Video Editor, Motion Nerd & Professional Handsome Guy",
    description:
      "Video editing, motion graphics, 3D, AI and a slightly dangerous amount of curiosity."
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
    <html lang="vi">
      <body className={`${sans.variable} ${serif.variable}`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
