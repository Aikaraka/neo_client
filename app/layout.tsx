import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import QueryProvider from "@/components/common/queryProvider";
import { AuthProvider } from "@/utils/supabase/authProvider";
import ResponsiveWrapper from "@/components/common/responsiveWrapper";
import SuspenseBoundary from "@/components/common/suspenseBoundary";

const NanumSquareNeo = localFont({
  src: [
    {
      path: "./fonts/NanumSquareNeo-Variable.woff2",
      style: "normal",
    },
    {
      path: "./fonts/NanumSquareNeo-Variable.woff",
      style: "normal",
    }
  ],
  display: "swap",
  fallback: ["'Malgun Gothic'", "'Apple SD Gothic Neo'", "sans-serif"],
  preload: true,
  variable: "--font-nanum",
});

export const metadata: Metadata = {
  title: "NEO",
  description: "생성형 AI 인터렉티브 소설",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn(NanumSquareNeo.variable, "bg-foreground/5")}>
      <ResponsiveWrapper>
        <AuthProvider>
          <QueryProvider>
            <SuspenseBoundary>{children}</SuspenseBoundary>
          </QueryProvider>
        </AuthProvider>
      </ResponsiveWrapper>
    </html>
  );
}
