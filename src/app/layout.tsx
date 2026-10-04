import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "EventHub — Discover, Book, and Manage Events",
    template: "%s | EventHub",
  },
  description:
    "Discover events, book tickets with guaranteed no-overselling checkout, join waitlists, and manage the full event lifecycle — all in one place.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    title: "EventHub — Discover, Book, and Manage Events",
    description:
      "Discover events, book tickets, and manage the full event lifecycle.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body className={`${geist.variable} font-sans`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
