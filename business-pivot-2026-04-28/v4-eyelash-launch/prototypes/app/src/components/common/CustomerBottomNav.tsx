"use client";

import { BottomTabBar, type TabItem } from "./BottomTabBar";
import { Home, Sparkles, MessageCircle, CalendarDays, ImageIcon } from "lucide-react";

const customerTabs: TabItem[] = [
  { href: "/c", label: "홈", icon: Home },
  { href: "/c/sim", label: "AI 시뮬", icon: Sparkles },
  { href: "/c/chat", label: "챗봇", icon: MessageCircle },
  { href: "/c/reserve", label: "예약", icon: CalendarDays },
  { href: "/c/menu", label: "메뉴", icon: ImageIcon },
];

export function CustomerBottomNav() {
  return <BottomTabBar tabs={customerTabs} />;
}
