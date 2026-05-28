export type SeededReview = {
  id: string;
  nickname: string;
  visits: number;
  rating: number;
  reviewText: string;
  draftReply: string;
  channel: "naver" | "instagram";
  collectedAt: string;
};

export const SEED_REVIEWS: SeededReview[] = [
  {
    id: "rv001",
    nickname: "Soominnnn",
    visits: 10,
    rating: 5,
    reviewText:
      "속눈썹 연장 유목민이었는데 드디어 정착한 곳…✨ 벌써 10번 넘게 방문한 유어라인 찐후기 남겨요! 컬도 항상 제 눈매에 맞게 잘 봐주시구 한 올 한 올 정성스럽게 해주셔서 항상 마음에 들어요♡",
    draftReply:
      "Soominnnn님~ 10번째 방문 정착하셨다니 너무 감동입니당♡♡\n한 올 한 올 봐드린 거 마음에 드신다니 다행이네요~\n건조한 날씨 영양제 꼭 챙겨서 발라주세욤~!!",
    channel: "naver",
    collectedAt: "2026-05-29T07:42:00.000Z",
  },
  {
    id: "rv002",
    nickname: "에츄19",
    visits: 3,
    rating: 5,
    reviewText:
      "내돈내산 3번째 방문이에요ㅎㅎㅎ 속눈썹펌 유목민이였는데 사장님 만나고 정착햇어요. 펌인데도 컬이 너무 자연스럽고 결도 부드러워요. 추천추천!!",
    draftReply:
      "에츄19님~ 3번째 방문 너무 감사합니다♡\n자연스러운 펌 마음에 드셨다니 저도 너무 기쁘네요 ㅎㅎ\n환절기 영양제 꼭 발라주시구~ 이쁘게 하고 다니세용~!!",
    channel: "naver",
    collectedAt: "2026-05-29T07:55:00.000Z",
  },
  {
    id: "rv003",
    nickname: "윤지미니",
    visits: 1,
    rating: 5,
    reviewText:
      "처음 방문이라 긴장했는데 사장님이 너무 친절하게 컬·디자인 설명해주셔서 안심하고 받았어요. C컬 맥스로 했는데 인생 속눈썹 만났네요♡ 다음에도 꼭 올게요!",
    draftReply:
      "윤지미니님~ 첫 방문이셨군요♡ 긴장하셨는데 잘 받아주셔서 감사해요~\nC컬 맥스가 인생 속눈썹이 됐다니 저도 너무 기뻐요 ㅎㅎ\n다음 방문 때도 결 잘 봐드릴게요~!!",
    channel: "naver",
    collectedAt: "2026-05-29T08:10:00.000Z",
  },
  {
    id: "rv004",
    nickname: "lovely_jin",
    visits: 6,
    rating: 5,
    reviewText:
      "벌써 6번째 방문... 사당역 근처에서 이만한 곳 없어요 진짜!! 1:1 단독시술이라 편하게 받을 수 있고 영양펌 효과가 진짜 좋아요. 단골 됐어요♡",
    draftReply:
      "lovely_jin님~ 6번째 방문 너무 감사해요♡\n1:1 단독시술 편하게 받아주신다니 저도 안심이네요 ㅎㅎ\n영양펌은 매번 영양 가득 챙겨드릴게요~ 단골 환영합니다♡♡",
    channel: "naver",
    collectedAt: "2026-05-29T08:25:00.000Z",
  },
];
