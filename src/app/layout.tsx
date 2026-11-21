import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meri Padhai Tracker 🌟 | Daily Study & Doubts",
  description: "Bhanji aur Mama ka simple, easy study and doubt tracker!",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Padhai Tracker",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-pink-50/50 text-slate-800 font-sans selection:bg-purple-200 selection:text-purple-900 pb-20 md:pb-6">
        {children}
      </body>
    </html>
  );
}
