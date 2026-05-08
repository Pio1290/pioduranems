import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e53935" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1b2a" },
  ],
};

export const metadata: Metadata = {
  title: "EMS NC II Reviewer - Emergency Medical Services Study Platform",
  description: "Complete EMS NC II competency assessment reviewer with interactive quizzes, scenarios, simulations, and bilingual support (English/Filipino). Prepare for TESDA certification.",
  keywords: ["EMS NC II", "TESDA", "Emergency Medical Services", "EMS Reviewer", "Paramedic", "BLS", "CPR", "First Responder", "Philippines"],
  authors: [{ name: "EMS NC II Reviewer" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
      { url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚑</text></svg>" },
    ],
    apple: [
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    title: "EMS NC II Reviewer",
    description: "Complete TESDA EMS NC II assessment preparation platform",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EMS NC II Reviewer",
    description: "Complete TESDA EMS NC II assessment preparation platform",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EMS NCII",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "EMS NCII",
    "application-name": "EMS NCII",
    "msapplication-TileColor": "#e53935",
    "msapplication-tap-highlight": "no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="apple-touch-startup-image" href="/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EMS NCII" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
