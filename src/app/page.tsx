"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Share2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Edit3,
  Plus,
  Trash2,
  RotateCcw,
  X,
  Mail,
  Video,
  ShoppingBag,
  Globe,
  MessageCircle,
  Link as LinkIcon,
} from "lucide-react";
import { ProfileData, DEFAULT_PROFILE, LinkItem } from "@/types/profile";

const STORAGE_KEY = "mylink_profile_data";

// SNS 아이콘 컴포넌트 매핑
function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "instagram":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
      );
    case "youtube":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    case "tiktok":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      );
    case "blog":
      return (
        <span className="text-[13px] font-black tracking-tight text-[#03C75A]">
          N
        </span>
      );
    case "email":
      return <Mail className="h-5 w-5" />;
    default:
      return <ExternalLink className="h-5 w-5" />;
  }
}

// 링크 아이콘 헬퍼
function getLinkIcon(iconType?: string) {
  switch (iconType) {
    case "video":
      return <Video className="h-5 w-5 text-[#3182F6]" />;
    case "shopping":
      return <ShoppingBag className="h-5 w-5 text-[#F04452]" />;
    case "message":
      return <MessageCircle className="h-5 w-5 text-[#FF9E00]" />;
    case "globe":
      return <Globe className="h-5 w-5 text-[#04C056]" />;
    default:
      return <LinkIcon className="h-5 w-5 text-[#4E5968]" />;
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 시연용 편집 모달 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<ProfileData>(DEFAULT_PROFILE);

  // 1. 로컬스토리지에서 프로필 불러오기 (Mount 시)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
        setEditForm(parsed);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
      }
    } catch (e) {
      console.error("로컬스토리지 로드 실패:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // 2. 로컬스토리지에 저장하기
  const handleSaveProfile = (updated: ProfileData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setProfile(updated);
      setIsEditModalOpen(false);
      showToast("로컬 스토리지에 저장되었어요 ✨");
    } catch (e) {
      console.error("저장 실패:", e);
      showToast("저장에 실패했어요");
    }
  };

  // 3. 기본값으로 초기화
  const handleResetToDefault = () => {
    if (confirm("프로필을 기본 샘플 데이터로 초기화할까요?")) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
        setProfile(DEFAULT_PROFILE);
        setEditForm(DEFAULT_PROFILE);
        setIsEditModalOpen(false);
        showToast("기본 데이터로 초기화되었어요");
      } catch (e) {
        console.error("초기화 실패:", e);
      }
    }
  };

  // 링크 공유 기능
  const handleShare = () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        navigator
          .share({
            title: `${profile.displayName} - 마이링크`,
            text: profile.bio,
            url: window.location.href,
          })
          .catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast("프로필 링크가 복사되었어요");
      }
    }
  };

  // 편집 모달 열기
  const openEditModal = () => {
    setEditForm(JSON.parse(JSON.stringify(profile)));
    setIsEditModalOpen(true);
  };

  // 링크 추가 핸들러
  const handleAddLink = () => {
    const newLink: LinkItem = {
      id: "l_" + Date.now(),
      title: "새 링크 타이틀",
      subtitle: "링크에 대한 간단한 설명",
      url: "https://",
      iconType: "link",
    };
    setEditForm((prev) => ({
      ...prev,
      links: [newLink, ...prev.links],
    }));
  };

  // 링크 삭제 핸들러
  const handleDeleteLink = (id: string) => {
    setEditForm((prev) => ({
      ...prev,
      links: prev.links.filter((l) => l.id !== id),
    }));
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2F4F6]">
        <div className="text-[15px] font-medium text-[#8B95A1]">프로필을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#F2F4F6] pb-24 text-[#191F28] antialiased">
      {/* TDS Top App Bar */}
      <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between bg-[#F2F4F6]/90 px-5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-[17px] font-bold tracking-tight text-[#191F28]">
            마이링크
          </span>
          <span className="rounded-md bg-[#E5E8EB] px-1.5 py-0.5 text-[10px] font-medium text-[#4E5968]">
            시연 모드
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* 시연용 프로필 편집 버튼 */}
          <button
            onClick={openEditModal}
            type="button"
            className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-[#3182F6] shadow-sm transition hover:bg-[#E8F3FF] active:scale-95"
            aria-label="프로필 수정"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>편집</span>
          </button>

          {/* 공유 버튼 */}
          <button
            onClick={handleShare}
            type="button"
            aria-label="공유하기"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#4E5968] transition hover:bg-[#E5E8EB] active:bg-[#D1D6DB]"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col gap-4 px-4 pt-2">
        {/* Profile Card */}
        <section className="rounded-3xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col items-center text-center">
            {/* Avatar (76px) */}
            <div className="relative h-[76px] w-[76px] overflow-hidden rounded-full bg-[#F2F4F6] ring-4 ring-[#E8F3FF]">
              <Image
                src={profile.avatarUrl}
                alt={`${profile.displayName} 프로필 사진`}
                fill
                sizes="76px"
                className="object-cover"
                priority
              />
            </div>

            {/* Name & Badge */}
            <div className="mt-3.5 flex flex-col items-center">
              <span className="rounded-full bg-[#E8F3FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#3182F6]">
                {profile.badgeText}
              </span>
              <h1 className="mt-1.5 text-[22px] font-bold tracking-tight text-[#191F28]">
                {profile.displayName}
              </h1>
              <p className="text-[13px] text-[#8B95A1]">@{profile.username}</p>
            </div>

            {/* Bio Description */}
            <p className="mt-3 text-[14px] leading-relaxed text-[#4E5968]">
              {profile.bio}
            </p>

            {/* Social Icons Bar */}
            {profile.socialLinks && profile.socialLinks.length > 0 && (
              <div className="mt-5 flex items-center justify-center gap-2 border-t border-[#F2F4F6] pt-4">
                {profile.socialLinks.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F9FAFB] text-[#4E5968] transition hover:bg-[#E5E8EB] hover:text-[#191F28] active:scale-95"
                  >
                    <SocialIcon platform={s.platform} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Links Section */}
        <section className="overflow-hidden rounded-3xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="px-5 pt-5 pb-2">
            <h2 className="text-[17px] font-bold text-[#191F28]">
              추천 링크
            </h2>
          </div>

          <div className="divide-y divide-[#F2F4F6]">
            {profile.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between px-5 py-4 transition hover:bg-[#F9FAFB] active:bg-[#F2F4F6]"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3.5">
                  {/* Icon Avatar */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F2F4F6] group-hover:bg-white transition-colors shadow-none group-hover:shadow-sm">
                    {getLinkIcon(link.iconType)}
                  </div>

                  {/* Text Stack */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[15px] font-semibold text-[#191F28]">
                        {link.title}
                      </span>
                      {link.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            link.badgeColor || "bg-[#E8F3FF] text-[#3182F6]"
                          }`}
                        >
                          {link.badge}
                        </span>
                      )}
                    </div>
                    {link.subtitle && (
                      <p className="mt-0.5 truncate text-[13px] text-[#8B95A1]">
                        {link.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <ChevronRight className="ml-2 h-5 w-5 shrink-0 text-[#B0B8C1] transition group-hover:translate-x-0.5 group-hover:text-[#4E5968]" />
              </a>
            ))}

            {profile.links.length === 0 && (
              <div className="py-10 text-center text-[14px] text-[#8B95A1]">
                등록된 링크가 없어요. 상단 [편집] 버튼을 눌러 추가해보세요!
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-2 py-6 text-center text-[12px] text-[#8B95A1]">
          <p className="font-medium text-[#4E5968]">마이링크 (MyLink)</p>
          <p className="mt-1">로컬스토리지 기반 프로필 시연 데모</p>
        </footer>
      </div>

      {/* TDS Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-[#191F28] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.2)] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-[#04C056]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 시연용 프로필 편집 모달 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4">
          <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#F2F4F6] px-5 py-4">
              <div>
                <h3 className="text-[17px] font-bold text-[#191F28]">프로필 편집</h3>
                <p className="text-[12px] text-[#8B95A1]">수정 시 로컬 스토리지에 즉시 동기화됩니다</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#8B95A1] hover:bg-[#F2F4F6]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Profile Inputs */}
              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-1">
                  닉네임
                </label>
                <input
                  type="text"
                  value={editForm.displayName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, displayName: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E5E8EB] bg-[#F9FAFB] px-3.5 py-2.5 text-[14px] text-[#191F28] focus:border-[#3182F6] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-1">
                  태그 / 분야
                </label>
                <input
                  type="text"
                  value={editForm.badgeText}
                  onChange={(e) =>
                    setEditForm({ ...editForm, badgeText: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E5E8EB] bg-[#F9FAFB] px-3.5 py-2.5 text-[14px] text-[#191F28] focus:border-[#3182F6] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-1">
                  한 줄 소개 (Bio)
                </label>
                <textarea
                  rows={2}
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E5E8EB] bg-[#F9FAFB] px-3.5 py-2.5 text-[14px] text-[#191F28] focus:border-[#3182F6] focus:bg-white focus:outline-none resize-none"
                />
              </div>

              {/* Links Management */}
              <div className="pt-2 border-t border-[#F2F4F6]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-bold text-[#191F28]">링크 목록</span>
                  <button
                    onClick={handleAddLink}
                    type="button"
                    className="flex items-center gap-1 rounded-lg bg-[#E8F3FF] px-2.5 py-1 text-[12px] font-semibold text-[#3182F6] hover:bg-[#d6e9ff]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>링크 추가</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {editForm.links.map((link, idx) => (
                    <div
                      key={link.id}
                      className="rounded-2xl border border-[#E5E8EB] bg-[#F9FAFB] p-3 space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-[#8B95A1]">
                          링크 #{idx + 1}
                        </span>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          type="button"
                          className="text-[#F04452] hover:bg-[#FFF0F0] p-1 rounded-md"
                          title="삭제"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="링크 제목"
                        value={link.title}
                        onChange={(e) => {
                          const newLinks = [...editForm.links];
                          newLinks[idx].title = e.target.value;
                          setEditForm({ ...editForm, links: newLinks });
                        }}
                        className="w-full rounded-lg border border-[#E5E8EB] bg-white px-2.5 py-1.5 text-[13px] text-[#191F28] focus:border-[#3182F6] focus:outline-none"
                      />

                      <input
                        type="text"
                        placeholder="간단한 부제목/설명 (선택)"
                        value={link.subtitle || ""}
                        onChange={(e) => {
                          const newLinks = [...editForm.links];
                          newLinks[idx].subtitle = e.target.value;
                          setEditForm({ ...editForm, links: newLinks });
                        }}
                        className="w-full rounded-lg border border-[#E5E8EB] bg-white px-2.5 py-1.5 text-[12px] text-[#4E5968] focus:border-[#3182F6] focus:outline-none"
                      />

                      <input
                        type="text"
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...editForm.links];
                          newLinks[idx].url = e.target.value;
                          setEditForm({ ...editForm, links: newLinks });
                        }}
                        className="w-full rounded-lg border border-[#E5E8EB] bg-white px-2.5 py-1.5 text-[12px] text-[#3182F6] focus:border-[#3182F6] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-[#F2F4F6] bg-white p-4">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="flex items-center gap-1 text-[13px] font-semibold text-[#8B95A1] hover:text-[#4E5968]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>기본값 초기화</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl bg-[#F2F4F6] px-4 py-2.5 text-[14px] font-semibold text-[#4E5968] hover:bg-[#E5E8EB]"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveProfile(editForm)}
                  className="rounded-xl bg-[#3182F6] px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-[#1B64DA] active:scale-95"
                >
                  저장하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
