import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import QueryProvider from "@/components/common/queryProvider";
import { AuthProvider } from "@/utils/supabase/authProvider";

const NanumSquareNeo = localFont({
  src: "./fonts/NanumSquareNeo-Variable.woff2",
  display: "swap",
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
    <html lang="ko" className={cn(NanumSquareNeo.className, "bg-foreground/5")}>
      <body className="max-w-md mx-auto">
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
