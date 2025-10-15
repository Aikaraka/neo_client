"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

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
                className="hover:text-gray-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                계정 관리
              </Link>
              <Link href="/mypage/history" className="hover:text-gray-600 transition-colors" onClick={() => setIsOpen(false)}>
                조각 구매/사용 내역
              </Link>
            </div>

            <div className="text-sm flex flex-col py-6 border-b px-3 gap-5">
              <Link
                href="/support"
                className="hover:text-gray-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                고객 지원 센터
              </Link>
              <Link 
                href="https://neo.featurebase.app/en/help/articles/8854968-speechballoon-yujeoyong-gaideu-v1"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-600 transition-colors" 
                onClick={() => setIsOpen(false)}>
                공지사항
              </Link>
            </div>

            <div className="text-sm flex flex-col py-6 border-b px-3 gap-5">
              <Link
                href="/terms/service"
                className="hover:text-gray-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                서비스 이용 약관
              </Link>
              <Link
                href="/terms/privacy"
                className="hover:text-gray-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                개인정보 처리 방침
              </Link>
              <Link
                href="/terms/copyright"
                className="hover:text-gray-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                저작권 및 지식재산권 관리 정책
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
