import { LinkItem } from "@/types/profile";

/**
 * 마이링크(MyLink) 서비스용 링크 더미 데이터
 * - PRD 사용자 시나리오(크리에이터 지은) 및 추천 링크 와이어프레임 규격 준수
 * - 다양한 카테고리(영상, 쇼핑/마켓, 커뮤니티, 블로그, 포트폴리오 등) 포함
 */
export const DUMMY_LINKS: LinkItem[] = [
  {
    id: "link-1",
    title: "이번 주 브이로그 보러가기 🎬",
    subtitle: "가을맞이 인테리어 룸투어 & 감성 카페 브이로그",
    url: "https://www.youtube.com/watch?v=sample1",
    badge: "NEW",
    badgeColor: "bg-[#E8F3FF] text-[#3182F6]",
    iconType: "video",
  },
  {
    id: "link-2",
    title: "착장 & 소품 정보 모음 🛍️",
    subtitle: "영상 속 문의 폭주했던 데일리 아이템 링크 정리",
    url: "https://smartstore.naver.com/sample_shop",
    badge: "인기",
    badgeColor: "bg-[#FFF0F0] text-[#F04452]",
    iconType: "shopping",
  },
  {
    id: "link-3",
    title: "[기간한정] 룸투어 소품 단독 15% 할인 🍂",
    subtitle: "브랜드 공식 콜라보레이션 특별 할인 쿠폰 발급",
    url: "https://brand.example.com/exclusive-sale",
    badge: "EVENT",
    badgeColor: "bg-[#FFF9E6] text-[#FF9E00]",
    iconType: "shopping",
  },
  {
    id: "link-4",
    title: "팬들과 함께하는 일상 오픈채팅 💬",
    subtitle: "자유롭게 소통하고 다음 콘텐츠 피드백을 나눠요",
    url: "https://open.kakao.com/o/sampleChat",
    badge: "소통",
    badgeColor: "bg-[#E8F3FF] text-[#3182F6]",
    iconType: "message",
  },
  {
    id: "link-5",
    title: "공식 네이버 블로그 일기 ✍️",
    subtitle: "사진과 감성 글로 기록하는 소소한 일상 기록",
    url: "https://blog.naver.com/jieun_daily",
    iconType: "globe",
  },
  {
    id: "link-6",
    title: "주간 라이프스타일 뉴스레터 구독 📮",
    subtitle: "매주 금요일 아침, 취향 가득한 공간과 플레이리스트 전달",
    url: "https://page.stibee.com/subscriptions/sample",
    iconType: "link",
  },
];

/**
 * 개발자 / 포트폴리오용 대체 더미 데이터 세트
 */
export const DEVELOPER_DUMMY_LINKS: LinkItem[] = [
  {
    id: "dev-link-1",
    title: "GitHub 저장소 둘러보기 💻",
    subtitle: "진행 중인 오픈소스 프로젝트 및 코드 아카이브",
    url: "https://github.com/baeterry",
    badge: "GitHub",
    badgeColor: "bg-[#F2F4F6] text-[#333D4B]",
    iconType: "globe",
  },
  {
    id: "dev-link-2",
    title: "기술 블로그 (Tech Insights) 📚",
    subtitle: "Next.js, Tailwind CSS, 프론트엔드 아키텍처 탐구",
    url: "https://velog.io/@baeterry",
    badge: "HOT",
    badgeColor: "bg-[#FFF0F0] text-[#F04452]",
    iconType: "globe",
  },
  {
    id: "dev-link-3",
    title: "인터랙티브 웹 포트폴리오 🚀",
    subtitle: "사용자 중심의 직관적인 디자인과 인터랙션 데모",
    url: "https://baeterry.dev",
    badge: "Portfolio",
    badgeColor: "bg-[#E8F3FF] text-[#3182F6]",
    iconType: "link",
  },
  {
    id: "dev-link-4",
    title: "LinkedIn 프로필 🤝",
    subtitle: "커리어 히스토리 및 비즈니스 네트워킹",
    url: "https://linkedin.com/in/baeterry",
    iconType: "link",
  },
];

export default DUMMY_LINKS;
