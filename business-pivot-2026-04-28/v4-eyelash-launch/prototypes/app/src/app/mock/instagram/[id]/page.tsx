import { notFound } from "next/navigation";
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { mockPosts } from "@/lib/mock-posts-store";

export const dynamic = "force-dynamic";

export default async function MockInstagramPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = mockPosts.get(id);
  if (!post || post.channel !== "instagram") return notFound();

  const date = new Date(post.createdAt);
  const dateLabel = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate()
  ).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-white text-black">
      {/* IG-style top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-12">
        <span className="text-base font-bold tracking-tight">Instagram</span>
        <span className="text-[11px] text-gray-500">모의 게시 데모</span>
      </div>

      <article className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 via-rose-500 to-fuchsia-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-pink-600">
                UL
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-semibold">yourline_official</span>
              <span className="text-[10px] text-gray-500">이수역 · 사당 속눈썹</span>
            </div>
          </div>
          <MoreHorizontal className="w-5 h-5" />
        </div>

        {/* Image with watermark */}
        <div className="relative w-full aspect-square bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageDataUrl}
            alt={post.serviceLabel}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/30 backdrop-blur-sm">
            <span className="text-[11px] font-bold text-pink-300 tracking-wide">U're Line ♡</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 px-3 pt-3">
          <Heart className="w-6 h-6" />
          <MessageCircle className="w-6 h-6" />
          <Send className="w-6 h-6" />
          <Bookmark className="w-6 h-6 ml-auto" />
        </div>
        <div className="px-3 pt-2 text-[13px] font-semibold">좋아요 124개</div>

        {/* Caption */}
        <div className="px-3 pt-1 pb-4 text-[13px] leading-relaxed">
          <span className="font-semibold mr-1">yourline_official</span>
          <span className="whitespace-pre-line text-foreground">{post.caption}</span>
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="mt-2 text-pink-700">{post.hashtags.join(" ")}</div>
          )}
          <div className="mt-2 text-[10px] text-gray-500 uppercase tracking-wide">{dateLabel}</div>
        </div>
      </article>
    </div>
  );
}
