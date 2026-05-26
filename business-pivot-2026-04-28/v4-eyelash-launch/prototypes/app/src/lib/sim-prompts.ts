export type ServiceKey =
  | "glue-half"
  | "glue-max"
  | "led"
  | "perm-point"
  | "perm-nutrition"
  | "perm-monolid";

export type ModelKey = "gpt-image-2" | "dall-e-2";

const BASE_RULES =
  "Edit ONLY within the transparent masked region (the eyelash area). " +
  "Do NOT change the iris, eyelid shape, skin, makeup, face features, or background — keep them pixel-identical. " +
  "Result must be highly photorealistic and clearly visible compared to the original lashes. " +
  "Lashes must look like real human hair: individual strands with tapered tips, slight variation in length, glossy black, soft natural shadow on the lid line.";

export const SERVICES: { key: ServiceKey; label: string; sub: string; prompt: string }[] = [
  {
    key: "glue-half",
    label: "글루연장 하프",
    sub: "내추럴 · 50가닥",
    prompt:
      `Add NATURAL HALF-VOLUME glue lash extensions (~50 strands per eye). ` +
      `Lashes are soft C-curl, length 9-11mm, evenly spaced with slight density in the outer third. ` +
      `Clearly longer and darker than the original lashes but still subtle — daytime everyday look. ` +
      BASE_RULES,
  },
  {
    key: "glue-max",
    label: "글루연장 맥스",
    sub: "풍성 · 120가닥",
    prompt:
      `Add DRAMATIC MAX-VOLUME glue lash extensions (~120 strands per eye). ` +
      `Lashes are pronounced D-curl with strong upward lift, length 12-14mm, fanned out densely from root to tip, glossy jet black. ` +
      `The eyes should look noticeably larger, glamorous, doll-like — a clearly visible transformation. ` +
      `Outer corners extend slightly beyond the eye for a soft cat-eye effect. ` +
      BASE_RULES,
  },
  {
    key: "led",
    label: "LED연장",
    sub: "광택 · 24h",
    prompt:
      `Add LED-BONDED lash extensions (~80 strands per eye). ` +
      `Lashes have a distinctive high-gloss wet-look shine, perfectly aligned in clean fans, C/D mixed curl, length 11-13mm. ` +
      `The shine should be clearly visible — almost reflective, like fresh salon work. ` +
      BASE_RULES,
  },
  {
    key: "perm-point",
    label: "펌포인트",
    sub: "바깥쪽 컬업",
    prompt:
      `Apply a POINT LASH PERM curling the NATURAL lashes — do NOT add extensions. ` +
      `Original lashes are clearly lifted upward, especially the outer third which is curled sharply for a cat-eye lift effect. ` +
      `Inner half stays gentle C-curl, outer corners strong D-curl. The change must be clearly visible vs the original. ` +
      BASE_RULES,
  },
  {
    key: "perm-nutrition",
    label: "영양펌",
    sub: "케어 · 자연 컬",
    prompt:
      `Apply a NUTRITION LASH PERM — gentle full-length curl on the natural lashes with no extensions. ` +
      `Lashes look noticeably healthier, fuller, glossier and lifted in a soft uniform C-curl from root to tip. ` +
      `The improvement vs original is clearly visible — like well-cared-for natural lashes. ` +
      BASE_RULES,
  },
  {
    key: "perm-monolid",
    label: "무쌍펌",
    sub: "무쌍 전용 컬",
    prompt:
      `Apply a MONOLID-OPTIMIZED LASH PERM on the natural lashes — no extensions. ` +
      `Lashes are lifted at a steeper angle than usual to clear the monolid fold and stay visible from the front, J-to-C curl. ` +
      `The eyes look more open and brighter — clearly visible result without adding lash volume. ` +
      BASE_RULES,
  },
];

export const MODEL_LABELS: Record<ModelKey, { label: string; desc: string }> = {
  "gpt-image-2": { label: "GPT-image-2", desc: "최신 (2026)" },
  "dall-e-2": { label: "DALL·E 2", desc: "구형 inpainting" },
};
