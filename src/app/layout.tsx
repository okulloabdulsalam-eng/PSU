import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "PharmaPrep Uganda – Pharmacy Licensing Exam Prep",
    template: "%s | PharmaPrep Uganda",
  },
  description:
    "The #1 online study platform for Ugandan pharmacy students preparing for pre-licensure and post-internship licensing examinations.",
  keywords: [
    "pharmacy",
    "Uganda",
    "exam prep",
    "PSU",
    "pharmacology",
    "licensing",
  ],
  manifest: "/manifest.json",
  themeColor: "#1A56DB",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  openGraph: {
    title: "PharmaPrep Uganda",
    description:
      "Ace your pharmacy licensing exams with Uganda's best study platform.",
    type: "website",
    locale: "en_UG",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
