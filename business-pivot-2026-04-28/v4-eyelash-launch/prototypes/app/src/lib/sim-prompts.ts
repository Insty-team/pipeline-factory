export type ServiceKey =
  | "glue-half"
  | "glue-max"
  | "led"
  | "perm-point"
  | "perm-nutrition"
  | "perm-monolid";

export type ModelKey = "gpt-image-2" | "dall-e-2";

export const SERVICES: { key: ServiceKey; label: string; sub: string; prompt: string }[] = [
  {
    key: "glue-half",
    label: "글루연장 하프",
    sub: "내추럴 · 50가닥",
    prompt:
      "Add natural half-volume glue eyelash extensions to this person's eyes. Subtle, soft, evenly spaced lashes that look realistic. Maintain the original face, skin tone, makeup, and pose exactly. Photorealistic.",
  },
  {
    key: "glue-max",
    label: "글루연장 맥스",
    sub: "풍성 · 120가닥",
    prompt:
      "Add dramatic max-volume glue eyelash extensions to this person's eyes. Lush, dense, glossy black lashes with C-curl, fanned out for a glamorous look. Maintain the original face, skin tone, makeup, and pose exactly. Photorealistic.",
  },
  {
    key: "led",
    label: "LED연장",
    sub: "광택 · 24h",
    prompt:
      "Add LED-bonded eyelash extensions to this person's eyes. Glossy, well-defined lashes with a slight shine, perfectly aligned, salon-finish quality. Maintain the original face, skin tone, makeup, and pose exactly. Photorealistic.",
  },
  {
    key: "perm-point",
    label: "펌포인트",
    sub: "바깥쪽 컬업",
    prompt:
      "Apply a lash perm with point accent on the outer corners of this person's eyes. Natural lashes lifted strongly at the outer ends for a cat-eye effect. No extensions added — just curled natural lashes. Maintain everything else exactly. Photorealistic.",
  },
  {
    key: "perm-nutrition",
    label: "영양펌",
    sub: "케어 · 자연 컬",
    prompt:
      "Apply a gentle lash perm with nutrition treatment to this person's natural lashes. Healthy, lifted, naturally curled lashes — no extensions, just well-conditioned natural eyelashes with subtle upward curl. Maintain everything else exactly. Photorealistic.",
  },
  {
    key: "perm-monolid",
    label: "무쌍펌",
    sub: "무쌍 전용 컬",
    prompt:
      "Apply a monolid-friendly lash perm to this person's eyes. Gentle natural curl optimized for monolid eyes — lashes lifted enough to be visible without covering. No extensions. Maintain everything else exactly. Photorealistic.",
  },
];

export const MODEL_LABELS: Record<ModelKey, { label: string; desc: string }> = {
  "gpt-image-2": { label: "GPT-image-2", desc: "최신 (2026)" },
  "dall-e-2": { label: "DALL·E 2", desc: "구형 inpainting" },
};
