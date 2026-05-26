export type MockPost = {
  id: string;
  channel: "instagram" | "naver";
  imageDataUrl: string;
  serviceLabel: string;
  caption?: string;
  hashtags?: string[];
  blogTitle?: string;
  blogBody?: string;
  createdAt: number;
};

declare global {
  // eslint-disable-next-line no-var
  var __mockPosts: Map<string, MockPost> | undefined;
}

export const mockPosts: Map<string, MockPost> =
  globalThis.__mockPosts ?? (globalThis.__mockPosts = new Map());

export function newPostId() {
  return Math.random().toString(36).slice(2, 10);
}
