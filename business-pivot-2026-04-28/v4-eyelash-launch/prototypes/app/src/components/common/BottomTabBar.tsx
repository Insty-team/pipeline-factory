"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

export interface TabItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function BottomTabBar({ tabs }: { tabs: TabItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="mx-auto max-w-md px-3 pb-2">
        <div className="glass rounded-3xl shadow-lg border border-white/40 px-1 py-1">
          <div className="flex items-center justify-around">
            {tabs.map((tab) => {
              const isActive =
                tab.href === pathname ||
                (tab.href !== "/c" &&
                  tab.href !== "/o" &&
                  pathname.startsWith(tab.href));
              const Icon = tab.icon;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="relative flex-1 flex flex-col items-center justify-center py-2 px-1"
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab-bg"
                      className="absolute inset-0 mx-1 rounded-2xl bg-pink-100"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-0.5">
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? "text-pink-600" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-[10px] font-medium transition-colors ${
                        isActive ? "text-pink-600" : "text-gray-500"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
