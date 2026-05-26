"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { TopAppBar } from "@/components/common/TopAppBar";

const sets = [
  {
    id: "pricing",
    label: "가격표",
    emoji: "💰",
    cards: ["1A_menu_landscape", "1B1_cover_vertical", "1B2_eyelash_extensions", "1B3_eyelash_perm", "1B4_membership_medipink"],
  },
  {
    id: "curl",
    label: "컬 비교",
    emoji: "💕",
    cards: ["2A_cover", "2B_jcurl", "2C_ccurl", "2D_dcurl", "2E_eyetype_match", "2F_cta"],
  },
  {
    id: "medipink",
    label: "메디핑크",
    emoji: "🌸",
    cards: ["3A_cover_campaign", "3B_effect_5steps", "3C_pricing_package", "3D_before_after", "3E_cta_event"],
  },
];

export default function MenuPage() {
  const [activeSet, setActiveSet] = useState("pricing");
  const [zoomedImg, setZoomedImg] = useState<string | null>(null);

  const cards = sets.find((s) => s.id === activeSet)?.cards ?? [];

  return (
    <>
      <TopAppBar title="🎨 메뉴·디자인" showBack />

      <div className="px-5 py-5">
        <p className="text-sm text-muted-foreground mb-4 text-center">
          가격표·컬 비교·메디핑크 — 총 16장 ♡
        </p>

        {/* 세트 탭 */}
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
          {sets.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSet(s.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeSet === s.id
                  ? "bg-pink-500 text-white shadow-md"
                  : "bg-white border border-pink-200 text-pink-700"
              }`}
            >
              <span className="mr-1">{s.emoji}</span>
              {s.label} <span className="opacity-60 text-xs">({sets.find((x) => x.id === s.id)?.cards.length})</span>
            </button>
          ))}
        </div>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-2 gap-3">
          {cards.map((card, i) => (
            <motion.div
              key={card}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setZoomedImg(card)}
              className="aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-pink-100 shadow-md cursor-pointer hover:shadow-xl transition-shadow"
            >
              <Image
                src={`/cards/${card}.png`}
                alt={card}
                width={400}
                height={500}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Zoom modal */}
      {zoomedImg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setZoomedImg(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative max-w-md w-full"
          >
            <Image
              src={`/cards/${zoomedImg}.png`}
              alt={zoomedImg}
              width={1080}
              height={1350}
              className="w-full h-auto rounded-2xl"
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
