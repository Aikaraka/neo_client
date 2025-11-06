"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Loader2 } from "lucide-react";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [, startTransition] = useTransition();
  const [pendingLink, setPendingLink] = useState<string | null>(null);
  const pathname = usePathname();

  // 경로가 변경되면 pending 상태 초기화
  useEffect(() => {
    setPendingLink(null);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar-content");
      const sidebarButton = document.getElementById("sidebar-button");

      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        sidebarButton &&
        !sidebarButton.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <button
        id="sidebar-button"
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Image src="/hambuger.svg" alt="menu" width={15} height={15} />
      </button>

      {/* Backdrop */}
      <div
        className={`absolute md:fixed top-0 right-0 w-screen h-screen bg-black/50 transition-opacity duration-300 z-40
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Sidebar */}
      <div
        id="sidebar-content"
        className={`absolute right-0 top-0 md:fixed h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-end p-2">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="flex flex-col justify-between w-full h-full pt-2">
          <div>
            <div className="text-sm flex flex-col py-6 border-b px-3 gap-5">
              <Link
                href="/mypage"
                className={`flex items-center gap-2 hover:text-gray-600 transition-colors ${
                  pendingLink === "/mypage" ? "opacity-50 cursor-wait" : ""
                }`}
                onClick={() => {
                  setPendingLink("/mypage");
                  startTransition(() => {
                    setIsOpen(false);
                  });
                }}
              >
                {pendingLink === "/mypage" && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                계정 관리
              </Link>
              <Link 
                href="/mypage/history" 
                className={`flex items-center gap-2 hover:text-gray-600 transition-colors ${
                  pendingLink === "/mypage/history" ? "opacity-50 cursor-wait" : ""
                }`}
                onClick={() => {
                  setPendingLink("/mypage/history");
                  startTransition(() => {
                    setIsOpen(false);
                  });
                }}
              >
                {pendingLink === "/mypage/history" && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                조각 구매/사용 내역
              </Link>
            </div>

            <div className="text-sm flex flex-col py-6 border-b px-3 gap-5">
              <Link
                href="/support"
                className={`flex items-center gap-2 hover:text-gray-600 transition-colors ${
                  pendingLink === "/support" ? "opacity-50 cursor-wait" : ""
                }`}
                onClick={() => {
                  setPendingLink("/support");
                  startTransition(() => {
                    setIsOpen(false);
                  });
                }}
              >
                {pendingLink === "/support" && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                고객 지원 센터
              </Link>
              <Link 
                href="https://neo.featurebase.app/en/help/articles/8854968-speechballoon-yujeoyong-gaideu-v1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gray-600 transition-colors"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                공지사항
              </Link>
            </div>

            <div className="text-sm flex flex-col py-6 border-b px-3 gap-5">
              <Link
                href="/terms/service"
                className={`flex items-center gap-2 hover:text-gray-600 transition-colors ${
                  pendingLink === "/terms/service" ? "opacity-50 cursor-wait" : ""
                }`}
                onClick={() => {
                  setPendingLink("/terms/service");
                  startTransition(() => {
                    setIsOpen(false);
                  });
                }}
              >
                {pendingLink === "/terms/service" && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                서비스 이용 약관
              </Link>
              <Link
                href="/terms/privacy"
                className={`flex items-center gap-2 hover:text-gray-600 transition-colors ${
                  pendingLink === "/terms/privacy" ? "opacity-50 cursor-wait" : ""
                }`}
                onClick={() => {
                  setPendingLink("/terms/privacy");
                  startTransition(() => {
                    setIsOpen(false);
                  });
                }}
              >
                {pendingLink === "/terms/privacy" && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                개인정보 처리 방침
              </Link>
              <Link
                href="/terms/copyright"
                className={`flex items-center gap-2 hover:text-gray-600 transition-colors ${
                  pendingLink === "/terms/copyright" ? "opacity-50 cursor-wait" : ""
                }`}
                onClick={() => {
                  setPendingLink("/terms/copyright");
                  startTransition(() => {
                    setIsOpen(false);
                  });
                }}
              >
                {pendingLink === "/terms/copyright" && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                저작권 및 지식재산권 관리 정책
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
