import { NextRequest } from "next/server";
import { mockPosts, newPostId, type MockPost } from "@/lib/mock-posts-store";

export const runtime = "nodejs";

type PublishBody = {
  channel: "instagram" | "naver";
  imageDataUrl: string;
  serviceLabel: string;
  caption?: string;
  hashtags?: string[];
  blogTitle?: string;
  blogBody?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PublishBody;
    if (!body.channel || !body.imageDataUrl || !body.serviceLabel) {
      return Response.json({ error: "missing required fields" }, { status: 400 });
    }
    const id = newPostId();
    const post: MockPost = {
      id,
      channel: body.channel,
      imageDataUrl: body.imageDataUrl,
      serviceLabel: body.serviceLabel,
      caption: body.caption,
      hashtags: body.hashtags,
      blogTitle: body.blogTitle,
      blogBody: body.blogBody,
      createdAt: Date.now(),
    };
    mockPosts.set(id, post);
    return Response.json({
      id,
      url: `/mock/${body.channel}/${id}`,
    });
  } catch (err) {
    const e = err as { message?: string };
    return Response.json({ error: e.message ?? "unknown" }, { status: 500 });
  }
}
