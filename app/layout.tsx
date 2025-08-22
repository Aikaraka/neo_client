import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import QueryProvider from "@/components/common/queryProvider";
import { AuthProvider } from "@/utils/supabase/authProvider";
import ResponsiveWrapper from "@/components/common/responsiveWrapper";
import SuspenseBoundary from "@/components/common/suspenseBoundary";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { GlobalLoadingIndicator } from "@/components/common/GlobalLoadingIndicator";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster";
import { NovelDetailModal } from "@/components/common/NovelDetailModal"; // 모달 import

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
  genre,
}: Readonly<{
  children: React.ReactNode;
  genre: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn(NanumSquareNeo.variable, "bg-foreground/5")}>
      <Script src="https://cdn.portone.io/v2/browser-sdk.js" async />
      <body>
        <div className="flex flex-col min-h-screen">
          <LoadingProvider>
            <GlobalLoadingIndicator />
            <main className="flex-grow">
              <ResponsiveWrapper>
                <AuthProvider>
                  <QueryProvider>
                    <OnboardingProvider>
                      <SuspenseBoundary>{children}</SuspenseBoundary>
                    </OnboardingProvider>
                    <NovelDetailModal /> {/* 올바른 위치로 이동 */}
                  </QueryProvider>
                </AuthProvider>
              </ResponsiveWrapper>
            </main>
            {genre}
            <Toaster />
            {/* <NovelDetailModal />  <- 기존 위치 삭제 */}
          </LoadingProvider>
        </div>
      </body>
    </html>
  );
}
