import { notFound } from "next/navigation";
import { mockPosts } from "@/lib/mock-posts-store";

export const dynamic = "force-dynamic";

export default async function MockNaverPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = mockPosts.get(id);
  if (!post || post.channel !== "naver") return notFound();

  const date = new Date(post.createdAt);
  const dateLabel = `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Naver top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-12">
        <span className="text-base font-bold">
          <span className="text-green-600">N</span> blog
        </span>
        <span className="text-[11px] text-gray-500">모의 게시 데모</span>
      </div>

      <article className="max-w-2xl mx-auto px-5 py-6">
        {/* Blog header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
            UL
          </div>
          <div>
            <div className="text-sm font-semibold">유어라인 (이수·사당)</div>
            <div className="text-xs text-gray-500">속눈썹 전문샵 · {dateLabel}</div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold mt-5 leading-snug">{post.blogTitle}</h1>

        {/* Image with watermark */}
        <div className="relative w-full aspect-video bg-gray-100 mt-4 rounded-md overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageDataUrl}
            alt={post.blogTitle ?? post.serviceLabel}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/30 backdrop-blur-sm">
            <span className="text-[11px] font-bold text-pink-300 tracking-wide">U're Line ♡</span>
          </div>
        </div>

        {/* Body */}
        <div className="text-[14px] leading-[1.85] whitespace-pre-line mt-5 text-gray-800">
          {post.blogBody}
        </div>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {post.hashtags.map((h) => (
              <span
                key={h}
                className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700"
              >
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>♡ 공감 24 · 댓글 8</span>
          <span>조회 1,243</span>
        </div>
      </article>
    </div>
  );
}
