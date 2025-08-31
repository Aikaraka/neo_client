import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-500 text-xs py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="space-y-4 text-center sm:text-left">
          {/* Policy Links */}
          <div className="flex justify-center sm:justify-start space-x-4">
            <Link href="/terms/service" className="hover:text-gray-800">이용약관</Link>
            <Link href="/terms/privacy" className="hover:text-gray-800 font-semibold">개인정보처리방침</Link>
            <Link href="/terms/copyright" className="hover:text-gray-800">콘텐츠 심의 규정</Link>
          </div>
          
          {/* Company Info */}
          <div className="space-y-1">
            <p className="font-semibold text-gray-700">더퍼레이드</p>
            <p>
              <span>대표: 임대한</span>
              <span className="mx-2 text-gray-300">|</span>
              <span>사업자등록번호: 702-11-02885</span>
              <br className="sm:hidden" />
              <span className="mx-2 text-gray-300 hidden sm:inline">|</span>
              <span>통신판매업신고번호: 2025-서울서대문-0766</span>
            </p>
            <p>주소: 서울시 서대문구 성산로 18길 49</p>
            <p>
              <span>전화번호: 070-4517-7801</span>
              <span className="mx-2 text-gray-300">|</span>
              <span>문의: <a href="mailto:neoyourscene@gmail.com" className="hover:text-gray-800">neoyourscene@gmail.com</a></span>
            </p>
          </div>

          {/* Copyright */}
          <div className="text-gray-400 pt-4">
            <p>© 2025 TheParade. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 