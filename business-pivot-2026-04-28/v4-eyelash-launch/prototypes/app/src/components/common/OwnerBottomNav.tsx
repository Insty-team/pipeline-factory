"use client";

import { BottomTabBar, type TabItem } from "./BottomTabBar";
import {
  LayoutDashboard,
  Inbox,
  ImagePlus,
  MessageSquareReply,
} from "lucide-react";

const ownerTabs: TabItem[] = [
  { href: "/o", label: "대시보드", icon: LayoutDashboard },
  { href: "/o/inbox", label: "할 일", icon: Inbox },
  { href: "/o/content", label: "콘텐츠", icon: ImagePlus },
  { href: "/o/reply", label: "답글", icon: MessageSquareReply },
];

export function OwnerBottomNav() {
  return <BottomTabBar tabs={ownerTabs} />;
}
