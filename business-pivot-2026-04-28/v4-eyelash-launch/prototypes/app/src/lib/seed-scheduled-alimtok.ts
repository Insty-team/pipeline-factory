export type ScheduledAlimtok = {
  id: string;
  scheduledAt: string; // "HH:MM"
  templateId: string;
  templateName: string;
  channel: "알림톡" | "친구톡";
  category: "reservation" | "post-visit" | "loyalty" | "marketing";
  customerName: string;
  customerNote?: string;
  message: string;
  cta?: { label: string; href: string };
};

export const SCHEDULED_ALIMTOK: ScheduledAlimtok[] = [
  {
    id: "sched-A3-yoonjimini",
    scheduledAt: "09:00",
    templateId: "A3",
    templateName: "방문 당일",
    channel: "알림톡",
    category: "reservation",
    customerName: "윤지미니",
    customerNote: "10번째 방문 · 글루 맥스 13시",
    message:
      "윤지미니님~ 오늘 오후 1시 글루 맥스 예약이에요♡\n안경·콘택트렌즈는 시술 전에 미리 빼주시구, 메이크업도 가볍게 와주시면 좋아요~\n혹시 시간 변경 필요하시면 미리 카톡 주세요!",
    cta: {
      label: "📍 네이버 지도로 길찾기",
      href: "https://map.naver.com/p/search/유어라인%20이수속눈썹",
    },
  },
  {
    id: "sched-A4-hyohyo29",
    scheduledAt: "11:00",
    templateId: "A4",
    templateName: "D+1 후기 요청",
    channel: "알림톡",
    category: "post-visit",
    customerName: "효효29",
    customerNote: "어제 영양펌 시술 · 3번째",
    message:
      "효효29님 어제 영양펌 시술 만족스러우셨길 바라요♡ 잠깐 시간 되시면 후기 한 줄 부탁드려요~ 다음 시술 때 영양제 챙겨드릴게요!",
    cta: { label: "✍️ 후기 남기기", href: "/c/review" },
  },
  {
    id: "sched-A5-soominnnn",
    scheduledAt: "11:00",
    templateId: "A5",
    templateName: "D+28 재방문",
    channel: "친구톡",
    category: "loyalty",
    customerName: "Soominnnn",
    customerNote: "단골 10번째 · 28일 경과",
    message:
      "Soominnnn님 어느덧 4주 지났네요♡ 결 차분히 정리해드릴 시간이에요~ 편하신 날짜 알려주시면 자리 잡아드릴게요!",
    cta: { label: "재방문 예약하기", href: "/c/reserve" },
  },
  {
    id: "sched-D1-medipink-batch",
    scheduledAt: "14:00",
    templateId: "D1",
    templateName: "메디핑크 추천",
    channel: "친구톡",
    category: "marketing",
    customerName: "단골 5명 일괄",
    customerNote: "수요일 14시 · 매주 1회",
    message:
      "○○님~ 출산·마찰로 어두워진 컬러 케어, 통증 거의 없는 메디컬 멜라닌 케어 한번 받아보세요♡ 첫 방문 상담은 무료예요!",
    cta: { label: "💎 메디핑크 자세히 보기", href: "/c/menu" },
  },
  {
    id: "sched-D2-jiniyaaa",
    scheduledAt: "11:00",
    templateId: "D2",
    templateName: "영양제 D+42",
    channel: "친구톡",
    category: "loyalty",
    customerName: "Jiniyaaa",
    customerNote: "42일 경과 · 영양제 소진 시점",
    message:
      "Jiniyaaa님 영양제 다 쓰셨을 시기예요~ 다음 방문 때 1개 새로 챙겨드릴게요♡ 매일 한 번씩 발라주세욤!",
    cta: { label: "예약 잡기", href: "/c/reserve" },
  },
  {
    id: "sched-A2-newvisit",
    scheduledAt: "18:00",
    templateId: "A2",
    templateName: "방문 1일 전",
    channel: "알림톡",
    category: "reservation",
    customerName: "lovely_jin",
    customerNote: "내일 15시 예약 · 6번째",
    message:
      "lovely_jin님 내일 15시 예약이에요~ 컨디션 잘 챙기시구 편안하게 와주세요♡",
    cta: { label: "예약 확인", href: "/c/reserve" },
  },
  {
    id: "sched-A2-tomorrow11",
    scheduledAt: "18:00",
    templateId: "A2",
    templateName: "방문 1일 전",
    channel: "알림톡",
    category: "reservation",
    customerName: "에츄19",
    customerNote: "내일 11시 예약 · 4번째",
    message:
      "에츄19님 내일 11시 예약이에요~ 컨디션 잘 챙기시구 편안하게 와주세요♡",
    cta: { label: "예약 확인", href: "/c/reserve" },
  },
  {
    id: "sched-A2-tomorrow17",
    scheduledAt: "18:00",
    templateId: "A2",
    templateName: "방문 1일 전",
    channel: "알림톡",
    category: "reservation",
    customerName: "kkomi__",
    customerNote: "내일 17시 예약 · 첫 방문",
    message:
      "kkomi__님 내일 17시 예약이에요~ 첫 방문이시니 조금 일찍 와주시면 디자인 상담 같이 봐드릴게요♡",
    cta: { label: "예약 확인", href: "/c/reserve" },
  },
];
