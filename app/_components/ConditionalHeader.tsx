"use client";

import { usePathname } from 'next/navigation';
import MainHeader from './MainHeader';

const AUTH_ROUTES = ['/login', '/signup', '/find'];
const CHAT_ROUTE_PATTERN = /^\/novel\/[^/]+\/chat/;

export default function ConditionalHeader() {
  const pathname = usePathname();

  const isAuthPage = AUTH_ROUTES.some(route => pathname.startsWith(route));
  const isChatPage = CHAT_ROUTE_PATTERN.test(pathname);

  if (isAuthPage || isChatPage) {
    return null;
  }

  return <MainHeader />;
}
