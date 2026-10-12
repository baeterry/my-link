import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "baeterry | 토스 스타일 개발자 프로필",
  description: "사용자 경험을 고민하는 프론트엔드 개발자 baeterry의 프로필이에요.",
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
        {children}
      </body>
    </html>
  );
}
