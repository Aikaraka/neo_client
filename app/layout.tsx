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
import Script from "next/script";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn(NanumSquareNeo.variable, "bg-foreground/5")}>
      <Script src="https://cdn.portone.io/v2/browser-sdk.js" async />
      <body>
        <div className="flex flex-col min-h-screen" style={{ zoom: 0.9 }}>
          <LoadingProvider>
            <GlobalLoadingIndicator />
            <main className="flex-grow">
              <ResponsiveWrapper>
                <AuthProvider>
                  <QueryProvider>
                    <SuspenseBoundary>{children}</SuspenseBoundary>
                  </QueryProvider>
                </AuthProvider>
              </ResponsiveWrapper>
            </main>
          </LoadingProvider>
        </div>
      </body>
    </html>
  );
}
