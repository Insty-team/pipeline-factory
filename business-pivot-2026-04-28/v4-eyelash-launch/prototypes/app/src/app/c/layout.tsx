import { BottomTabBar, type TabItem } from "@/components/common/BottomTabBar";
import { Home, Sparkles, MessageCircle, CalendarDays, ImageIcon } from "lucide-react";

const customerTabs: TabItem[] = [
  { href: "/c", label: "홈", icon: Home },
  { href: "/c/sim", label: "AI 시뮬", icon: Sparkles },
  { href: "/c/chat", label: "챗봇", icon: MessageCircle },
  { href: "/c/reserve", label: "예약", icon: CalendarDays },
  { href: "/c/menu", label: "메뉴", icon: ImageIcon },
];

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-customer">
      <div className="mx-auto max-w-md min-h-screen pb-24">
        {children}
      </div>
      <BottomTabBar tabs={customerTabs} />
    </div>
  );
}
