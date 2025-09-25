"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

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
        <div className="flex flex-col justify-between w-full h-full pt-10">
          <div>
            <div className="flex justify-between border-b py-6 px-3">
              <h3 className="text-sm font-semibold">성인 콘텐츠 포함</h3>
              <button
                role="switch"
                aria-checked={isChecked}
                onClick={() => setIsChecked(!isChecked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${isChecked ? "bg-purple-600" : "bg-gray-200"}`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform
                    ${isChecked ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>

            <div className="text-sm flex flex-col py-6 border-b px-3 gap-5">
              <Link
                href="/account/setting"
                className="hover:text-gray-600 transition-colors"
              >
                계정 관리
              </Link>
              <Link href="/" className="hover:text-gray-600 transition-colors">
                언어 관리
              </Link>
              <Link href="/mypage/history" className="hover:text-gray-600 transition-colors">
                조각 구매/사용 내역
              </Link>
            </div>

            <div className="text-sm flex flex-col py-6 border-b px-3 gap-5">
              <Link href="/" className="hover:text-gray-600 transition-colors">
                고객 지원 센터
              </Link>
              <Link href="/" className="hover:text-gray-600 transition-colors">
                공지사항
              </Link>
            </div>

            <div className="text-sm flex flex-col py-6 border-b px-3 gap-5">
              <Link
                href="/terms/service"
                className="hover:text-gray-600 transition-colors"
              >
                서비스 이용 약관
              </Link>
              <Link
                href="/terms/privacy"
                className="hover:text-gray-600 transition-colors"
              >
                개인정보 처리 방침
              </Link>
              <Link
                href="/terms/copyright"
                className="hover:text-gray-600 transition-colors"
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
