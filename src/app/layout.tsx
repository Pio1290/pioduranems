import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EMS NC II Reviewer - Emergency Medical Services Study Platform",
  description: "Complete EMS NC II competency assessment reviewer with interactive quizzes, scenarios, simulations, and bilingual support (English/Filipino). Prepare for TESDA certification.",
  keywords: ["EMS NC II", "TESDA", "Emergency Medical Services", "EMS Reviewer", "Paramedic", "BLS", "CPR", "First Responder", "Philippines"],
  authors: [{ name: "EMS NC II Reviewer" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚑</text></svg>",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
