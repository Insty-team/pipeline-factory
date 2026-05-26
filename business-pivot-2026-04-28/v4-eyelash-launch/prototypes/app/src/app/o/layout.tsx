import { BottomTabBar, type TabItem } from "@/components/common/BottomTabBar";
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

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md min-h-screen pb-24">
        {children}
      </div>
      <BottomTabBar tabs={ownerTabs} />
    </div>
  );
}
