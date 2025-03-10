import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ResponsiveWrapper from "@/components/common/responsiveWrapper";
import { AuthProvider } from "@/utils/supabase/authProvider";
import QueryProvider from "@/components/common/queryProvider";
import { SearchProvider } from "./_components/SearchContext";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="ko" className={`${inter.className} bg-foreground/5`}>
      <body className="max-w-md min-w-[360px]  mx-auto relative">
        <AuthProvider>
          <QueryProvider>
            <SearchProvider>
              <ResponsiveWrapper>{children}</ResponsiveWrapper>
            </SearchProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
