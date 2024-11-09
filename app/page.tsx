"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Search,
  PenSquare,
  Home as HomeIcon,
  Archive,
  User,
  Sparkles,
  Heart,
  Mountain,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

function NavItem({
  icon: Icon,
  activeIcon: ActiveIcon,
  label,
  isActive,
  onClick,
}: {
  icon: typeof HomeIcon;
  activeIcon: typeof HomeIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center relative px-6",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
      data-tab={label.toLowerCase().replace(" ", "-")}
    >
      {isActive ? (
        <ActiveIcon className="h-6 w-6" />
      ) : (
        <Icon className="h-6 w-6" />
      )}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: "0px",
    width: "0px",
  });
  const navRef = useRef<HTMLDivElement>(null);

  const updateIndicator = (tabName: string) => {
    if (navRef.current) {
      const tabElement = navRef.current.querySelector(
        `[data-tab="${tabName}"]`
      );
      if (tabElement) {
        const { offsetLeft, offsetWidth } = tabElement as HTMLElement;
        setIndicatorStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => updateIndicator(activeTab), 0);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  const recommendedNovels = [
    { title: "난쟁이와 백설공주", image: "/example/temp1.png" },
    { title: "마법학교 아르피아", image: "/example/temp2.png" },
    { title: "인어공주", image: "/example/temp3.png" },
  ];

  const topNovels = [
    { title: "미래로 왔는데, 돈이 없다.", image: "/example/temp4.png" },
    { title: "나니아 연대기", image: "/example/temp5.png" },
    { title: "스타듀밸리", image: "/example/temp6.png" },
  ];

  const genres = [
    { title: "판타지", icon: Sparkles },
    { title: "로맨스", icon: Heart },
    { title: "추리", icon: Mountain },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-14 max-w-md items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Image
              src="/neo_emblem.svg"
              alt="NEO Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="font-semibold text-xl">NEO</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="relative bg-purple-500 hover:bg-purple-600 text-white rounded-full p-2 h-6"
            >
              <Image
                src="/diamond.svg"
                alt="token icon"
                height={10}
                width={10}
              />
              9999
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16">
        <div className="container max-w-md p-4 space-y-8">
          {/* Recommended Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Image
                src="/snowflake.svg"
                alt="icon"
                width={24}
                height={24}
                className="h-6 w-auto mr-2"
              />
              네오님의 취향 저격
            </h2>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-4">
                {recommendedNovels.map((novel, index) => (
                  <Card key={index} className="w-[150px] shrink-0">
                    <Link href="/detail">
                      <CardContent className="p-0">
                        <Image
                          src={novel.image}
                          alt={novel.title}
                          width={150}
                          height={150}
                          className="rounded-t-lg object-cover"
                        />
                        <div className="p-2">
                          <p className="text-sm truncate">{novel.title}</p>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>

          {/* Top 5 Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">🔥</span>
              실시간 TOP 5 소설
            </h2>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-4">
                {topNovels.map((novel, index) => (
                  <Card key={index} className="w-[150px] shrink-0">
                    <CardContent className="p-0">
                      <Image
                        src={novel.image}
                        alt={novel.title}
                        width={150}
                        height={200}
                        className="rounded-t-lg object-cover"
                      />
                      <div className="p-2">
                        <p className="text-sm truncate">{novel.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>

          {/* Genres Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4">장르</h2>
            <div className="grid grid-cols-3 gap-4">
              {genres.map((genre, index) => {
                const Icon = genre.icon;
                return (
                  <Card key={index} className="aspect-square">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                        <Icon className="h-6 w-6 text-purple-500" />
                      </div>
                      <span className="text-sm">{genre.title}</span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="container max-w-md">
          <div
            className="flex justify-around items-center py-2 relative"
            ref={navRef}
          >
            <NavItem
              icon={PenSquare}
              activeIcon={PenSquare}
              label="소설 제작"
              isActive={activeTab === "create"}
              onClick={() => handleTabChange("create")}
            />
            <NavItem
              icon={HomeIcon}
              activeIcon={HomeIcon}
              label="홈"
              isActive={activeTab === "home"}
              onClick={() => handleTabChange("home")}
            />
            <NavItem
              icon={Archive}
              activeIcon={Archive}
              label="보관함"
              isActive={activeTab === "archive"}
              onClick={() => handleTabChange("archive")}
            />
            <NavItem
              icon={User}
              activeIcon={User}
              label="마이페이지"
              isActive={activeTab === "mypage"}
              onClick={() => handleTabChange("mypage")}
            />
            <div
              className="absolute bottom-0 h-1 bg-primary transition-all duration-300 ease-in-out"
              style={indicatorStyle}
            />
          </div>
        </div>
      </nav>
    </div>
  );
}
