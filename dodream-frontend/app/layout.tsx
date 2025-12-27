import type React from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/lib/auth-context";
import { QueryProvider } from "@/lib/query-provider";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dodream.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Do x Dream | 두드림 Tech Blog",
    template: "%s | Do x Dream",
  },
  description:
    "기술을 통해 꿈을 실현하는 개발자들의 기술 블로그. 프론트엔드, 백엔드, 앱 개발 경험과 회고를 공유합니다.",
  keywords: ["기술 블로그", "프론트엔드", "백엔드", "React", "Next.js", "TypeScript", "개발", "회고"],
  authors: [{ name: "Do x Dream Team" }],
  creator: "Do x Dream",
  publisher: "Do x Dream",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "Do x Dream",
    title: "Do x Dream | 두드림 Tech Blog",
    description: "기술을 통해 꿈을 실현하는 개발자들의 기술 블로그",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Do x Dream Tech Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Do x Dream | 두드림 Tech Blog",
    description: "기술을 통해 꿈을 실현하는 개발자들의 기술 블로그",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geist.variable} font-sans antialiased`}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
