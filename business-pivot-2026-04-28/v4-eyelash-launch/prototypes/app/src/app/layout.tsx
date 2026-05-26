import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "유어라인 — 1:1 단독시술 속눈썹 전문샵",
  description: "이수·사당 7년차 1:1 단독시술 · AI 시술 시뮬레이션 · 첫 시술 5,000원 할인 쿠폰",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#E89BAE",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
