"use client";

import { BottomTabBar, type TabItem } from "./BottomTabBar";
import {
  LayoutDashboard,
  Inbox,
  ImagePlus,
  Bell,
  MessageSquareReply,
} from "lucide-react";

const ownerTabs: TabItem[] = [
  { href: "/o", label: "대시보드", icon: LayoutDashboard },
  { href: "/o/inbox", label: "받은요청", icon: Inbox },
  { href: "/o/content", label: "콘텐츠", icon: ImagePlus },
  { href: "/o/alimtok", label: "알림톡", icon: Bell },
  { href: "/o/reply", label: "답글", icon: MessageSquareReply },
];

export function OwnerBottomNav() {
  return <BottomTabBar tabs={ownerTabs} />;
}
