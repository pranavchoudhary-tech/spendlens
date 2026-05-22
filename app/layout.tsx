import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpendLens — Stop Overpaying for AI Tools",
  description:
    "Free AI spend audit for startup founders and engineering managers. See exactly where your team is overspending on AI tools like Cursor, Claude, ChatGPT, and Copilot — and get a plan to fix it.",
  keywords: [
    "AI tool audit",
    "AI spend",
    "reduce AI costs",
    "Cursor pricing",
    "Claude pricing",
    "ChatGPT pricing",
    "GitHub Copilot cost",
    "startup AI tools",
  ],
  authors: [{ name: "SpendLens" }],
  creator: "SpendLens",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://spendlens.vercel.app"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "SpendLens — Stop Overpaying for AI Tools",
    description:
      "Free AI spend audit. See where your team is bleeding money on AI subscriptions and get an actionable plan to save.",
    siteName: "SpendLens",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SpendLens — AI Spend Audit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendLens — Stop Overpaying for AI Tools",
    description:
      "Free AI spend audit. See where your team is bleeding money on AI subscriptions.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
