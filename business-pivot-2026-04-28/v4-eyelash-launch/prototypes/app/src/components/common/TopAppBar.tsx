"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Home } from "lucide-react";

interface TopAppBarProps {
  title?: string;
  showBack?: boolean;
  showHome?: boolean;
  rightAction?: React.ReactNode;
}

export function TopAppBar({
  title,
  showBack = false,
  showHome = true,
  rightAction,
}: TopAppBarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 pt-safe bg-white/80 backdrop-blur-lg border-b border-pink-100">
      <div className="mx-auto max-w-md px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1 min-w-0">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-pink-50 transition-colors"
              aria-label="뒤로"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}
          {title && (
            <h1 className="text-lg font-bold text-foreground truncate">
              {title}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-1">
          {rightAction}
          {showHome && (
            <Link
              href="/"
              className="p-2 rounded-full hover:bg-pink-50 transition-colors"
              aria-label="홈"
            >
              <Home className="w-5 h-5 text-gray-700" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
