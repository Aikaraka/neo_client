"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signout } from "@/utils/supabase/service/auth";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar-content");
      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        !(event.target as Element)
          .closest("button")
          ?.contains(document.querySelector(".lucide-menu"))
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

  const handleSignout = async () => {
    try {
      await signout();
    } catch {
    } finally {
      router.push("/");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Menu />
      </button>

      {/* Backdrop */}
      <div
        className={`absolute top-0 right-0 w-screen h-screen bg-black/50 transition-opacity duration-300 z-40
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Sidebar */}
      <div
        id="sidebar-content"
        className={`absolute right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50
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
              <Link href="/" className="hover:text-gray-600 transition-colors">
                계정 관리
              </Link>
              <Link href="/" className="hover:text-gray-600 transition-colors">
                언어 관리
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
              <Link href="/" className="hover:text-gray-600 transition-colors">
                서비스 이용 약관
              </Link>
              <Link href="/" className="hover:text-gray-600 transition-colors">
                개인정보 처리 방침
              </Link>
              <Link href="/" className="hover:text-gray-600 transition-colors">
                저작권 및 지식재산권 관리 정책
              </Link>
            </div>
          </div>

          <div className="absolute bottom-5 w-full px-5">
            <button
              onClick={handleSignout}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
