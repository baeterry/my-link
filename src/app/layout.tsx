import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "마이링크 (MyLink) | 나만의 통합 링크 페이지",
  description: "Google 로그인으로 쉽고 빠르게 나만의 링크를 만들고 공유하세요.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("h-full bg-[#F2F4F6]", "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col antialiased selection:bg-[#E8F3FF] selection:text-[#3182F6]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
