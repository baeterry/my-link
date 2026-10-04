export interface SocialLink {
  id: string;
  platform: "instagram" | "youtube" | "tiktok" | "blog" | "email" | "x";
  url: string;
  name: string;
}

export interface LinkItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  badge?: string;
  badgeColor?: string;
  iconType?: "video" | "shopping" | "globe" | "message" | "link";
}

export interface ProfileData {
  username: string;
  displayName: string;
  badgeText: string;
  avatarUrl: string;
  bio: string;
  socialLinks: SocialLink[];
  links: LinkItem[];
  contactEmail?: string;
}

export const DEFAULT_PROFILE: ProfileData = {
  username: "jieun_daily",
  displayName: "지은 JIEUN",
  badgeText: "크리에이터 · 라이프스타일",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  bio: "일상을 담는 브이로그와 좋아하는 공간, 따뜻한 취향을 공유해요 ✨",
  socialLinks: [
    {
      id: "s1",
      platform: "instagram",
      name: "Instagram",
      url: "https://instagram.com",
    },
    {
      id: "s2",
      platform: "youtube",
      name: "YouTube",
      url: "https://youtube.com",
    },
    {
      id: "s3",
      platform: "tiktok",
      name: "TikTok",
      url: "https://tiktok.com",
    },
    {
      id: "s4",
      platform: "blog",
      name: "Blog",
      url: "https://blog.naver.com",
    },
    {
      id: "s5",
      platform: "email",
      name: "Email",
      url: "mailto:jieun@example.com",
    },
  ],
  links: [
    {
      id: "l1",
      title: "이번 주 브이로그 보러가기 🎬",
      subtitle: "가을맞이 인테리어 룸투어 & 카페 브이로그",
      url: "https://youtube.com",
      badge: "NEW",
      badgeColor: "bg-[#E8F3FF] text-[#3182F6]",
      iconType: "video",
    },
    {
      id: "l2",
      title: "착장 & 소품 정보 모음 🛍️",
      subtitle: "영상 속 문의 많았던 아이템 링크 정리",
      url: "https://example.com/shop",
      badge: "인기",
      badgeColor: "bg-[#FFF0F0] text-[#F04452]",
      iconType: "shopping",
    },
    {
      id: "l3",
      title: "팬들과 함께하는 일상 오픈채팅 💬",
      subtitle: "자유롭게 소통하고 다음 영상 피드백을 나눠요",
      url: "https://open.kakao.com",
      iconType: "message",
    },
    {
      id: "l4",
      title: "공식 네이버 블로그 일기 ✍️",
      subtitle: "사진과 글로 기록하는 소소한 일상 이야기",
      url: "https://blog.naver.com",
      iconType: "globe",
    },
  ],
  contactEmail: "jieun_contact@example.com",
};
