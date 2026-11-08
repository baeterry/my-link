"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Edit3,
  Plus,
  RotateCw,
  Loader2,
  Mail,
  Video,
  ShoppingBag,
  Link as LinkIcon,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { ProfileData, DEFAULT_PROFILE, LinkItem } from "@/types/profile";
import { Header, GoogleIcon } from "@/components/Header";
import { AddLinkDialog } from "@/components/AddLinkDialog";
import { DeleteLinkDialog } from "@/components/DeleteLinkDialog";
import { LinkCardItem } from "@/components/LinkCardItem";
import { useAuth } from "@/context/AuthContext";
import {
  addLinkToFirestore,
  getLinksFromFirestore,
  subscribeLinksFromFirestore,
  updateLinkInFirestore,
  deleteLinkFromFirestore,
} from "@/lib/firestoreLinks";

// SNS 아이콘 컴포넌트 매핑
function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "instagram":
      return (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case "youtube":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
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

export default function ProfilePage() {
  const { user, userProfile, loading: authLoading, signInWithGoogle, updateProfileData } = useAuth();

  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLinksLoading, setIsLinksLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 프로필 편집 모달 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<ProfileData>(DEFAULT_PROFILE);

  // 링크 추가 및 삭제 다이얼로그 상태
  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = useState(false);
  const [deletingLink, setDeletingLink] = useState<LinkItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // 로그인된 유저가 바뀔 때마다 user/{user.uid}/links 실시간 동기화
  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribe = subscribeLinksFromFirestore(
      user.uid,
      (firestoreLinks) => {
        setLinks(firestoreLinks);
        setIsLinksLoading(false);
        setIsUpdating(false);
      },
      (err) => {
        console.warn("Firestore 실시간 연동 에러:", err);
        setIsLinksLoading(false);
        setIsUpdating(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  // 프로필 편집 모달 열기
  const openEditModal = () => {
    if (userProfile) {
      setEditForm(JSON.parse(JSON.stringify(userProfile)));
    } else if (user) {
      const emailPrefix = user.email ? user.email.split("@")[0] : "user";
      setEditForm({
        ...DEFAULT_PROFILE,
        displayName: emailPrefix,
        avatarUrl: user.photoURL || DEFAULT_PROFILE.avatarUrl,
        username: emailPrefix,
        contactEmail: user.email || DEFAULT_PROFILE.contactEmail,
      });
    }
    setIsEditModalOpen(true);
  };

  // 프로필 저장 핸들러 (Firestore user/{user.uid} 문서 업데이트)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setIsUpdating(true);
      await updateProfileData(editForm);
      setIsEditModalOpen(false);
      showToast("프로필 정보가 저장되었어요 ✨");
    } catch (e: unknown) {
      console.error("프로필 저장 실패:", e);
      showToast("프로필 저장에 실패했어요.");
    } finally {
      setIsUpdating(false);
    }
  };

  // 링크 복사 핸들러
  const handleCopyLink = (url: string, title: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast(`'${title}' 링크 주소가 복사되었어요 📋`);
    }
  };

  // 링크 수동 새로고침 (Firestore user/{user.uid}/links 조회)
  const handleRefresh = async () => {
    if (!user || isUpdating || isLinksLoading) return;
    try {
      setIsUpdating(true);
      const latestLinks = await getLinksFromFirestore(user.uid);
      setLinks(latestLinks);
      showToast("최신 링크 목록으로 갱신되었어요 ✨");
    } catch (e: unknown) {
      console.error("새로고침 실패:", e);
      showToast("목록 갱신에 실패했어요");
    } finally {
      setIsUpdating(false);
    }
  };

  // 새 링크 추가 시 Firestore user/{user.uid}/links에 저장
  const handleAddNewLink = async (newLink: LinkItem) => {
    if (!user) {
      showToast("로그인이 필요합니다.");
      return;
    }
    try {
      setIsUpdating(true);
      const savedLink = await addLinkToFirestore(user.uid, newLink);
      setLinks((prev) => {
        const exists = prev.some((l) => l.id === savedLink.id);
        return exists ? prev : [savedLink, ...prev];
      });
      showToast("새 링크가 Firestore에 성공적으로 저장되었어요 🚀");
    } catch (e: unknown) {
      console.error("Firestore 링크 추가 실패:", e);
      showToast("Firestore 링크 저장에 실패했어요");
      throw e;
    } finally {
      setTimeout(() => {
        setIsUpdating(false);
      }, 500);
    }
  };

  // 링크 인라인 수정 시 Firestore user/{user.uid}/links에 업데이트
  const handleUpdateLink = async (id: string, updatedData: Partial<Omit<LinkItem, "id">>) => {
    if (!user) {
      showToast("로그인이 필요합니다.");
      return;
    }
    try {
      setIsUpdating(true);
      await updateLinkInFirestore(user.uid, id, updatedData);
      setLinks((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...updatedData, updatedAtMs: Date.now() } : l))
      );
      showToast("링크가 수정되었어요 ✨");
    } catch (e: unknown) {
      console.error("Firestore 링크 수정 실패:", e);
      showToast("링크 수정에 실패했어요");
      throw e;
    } finally {
      setTimeout(() => {
        setIsUpdating(false);
      }, 500);
    }
  };

  // 링크 삭제 시 Firestore user/{user.uid}/links에서 삭제
  const handleDeleteLinkConfirm = async (id: string) => {
    if (!user) {
      showToast("로그인이 필요합니다.");
      return;
    }
    try {
      setIsUpdating(true);
      await deleteLinkFromFirestore(user.uid, id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      showToast("링크가 삭제되었어요 🗑️");
    } catch (e: unknown) {
      console.error("Firestore 링크 삭제 실패:", e);
      showToast("Firestore 링크 삭제에 실패했어요");
      throw e;
    } finally {
      setTimeout(() => {
        setIsUpdating(false);
      }, 500);
    }
  };

  // 링크 공유
  const handleShare = () => {
    if (typeof window !== "undefined") {
      const shareTitle = userProfile?.displayName || user?.displayName || "마이링크";
      const shareText = userProfile?.bio || "나만의 마이링크 페이지입니다.";
      if (navigator.share) {
        navigator
          .share({
            title: `${shareTitle} - 마이링크`,
            text: shareText,
            url: window.location.href,
          })
          .catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast("프로필 링크가 클립보드에 복사되었어요 📋");
      }
    }
  };

  // 로딩 화면
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2F4F6]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#3182F6]" />
          <div className="text-[15px] font-medium text-[#4E5968]">
            마이링크를 불러오는 중이에요...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F4F6]">
      <Header
        onShare={handleShare}
        showShare={false}
        onOpenEditProfile={openEditModal}
        onOpenAddLink={() => setIsAddLinkDialogOpen(true)}
        linksCount={links.length}
      />

      <main className="relative mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-md flex-col pb-24 text-[#191F28] antialiased">
        {/* ============================================================== */}
        {/* 케이스 1: 로그인을 안 했을 때 화면 (사용 안내 문구 및 로그인 유도) */}
        {/* ============================================================== */}
        {!user ? (
          <div className="flex flex-col gap-5 px-4 pt-6">
            {/* 온보딩 인트로 배너 */}
            <section className="overflow-hidden rounded-3xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E5E8EB]">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F3FF] text-[#3182F6] mb-4">
                  <Sparkles className="h-8 w-8 animate-pulse" />
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F3FF] px-3 py-1 text-[12px] font-semibold text-[#3182F6] mb-3">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>3초 만에 시작하는 나만의 링크</span>
                </div>

                <h1 className="text-[22px] font-bold tracking-tight text-[#191F28] mb-2 leading-snug">
                  로그인하고 나만의 링크 페이지를
                  <br />
                  간편하게 완성해보세요
                </h1>

                <p className="text-[14px] leading-relaxed text-[#6B7684] mb-6">
                  Google 소셜 계정으로 1초 만에 로그인하면,
                  <br />
                  인스타그램, 유튜브, 블로그, 포트폴리오를
                  <br />
                  단 하나의 깔끔한 토스 감성 페이지로 모을 수 있어요.
                </p>

                {/* 대형 구글 로그인 CTA 버튼 */}
                <button
                  onClick={() => signInWithGoogle()}
                  type="button"
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#3182F6] px-5 py-3.5 text-[15px] font-bold text-white shadow-md transition hover:bg-[#1B64DA] active:scale-[0.98]"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white p-1">
                    <GoogleIcon className="h-4 w-4" />
                  </div>
                  <span>Google 계정으로 시작하기</span>
                </button>
              </div>
            </section>

            {/* 로그인 후 사용 가능한 기능 안내 카드 */}
            <section className="rounded-3xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E5E8EB]">
              <h2 className="text-[15px] font-bold text-[#191F28] mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#3182F6]" />
                <span>로그인 후 이런 기능을 사용할 수 있어요</span>
              </h2>

              <ul className="space-y-3">
                <li className="flex items-start gap-3 rounded-2xl bg-[#F8F9FA] p-3 transition hover:bg-[#F2F4F6]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs text-[#3182F6] font-bold text-[13px]">
                    1
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#333D4B]">
                      개인화된 Firestore 저장소
                    </h3>
                    <p className="text-[12px] text-[#8B95A1] leading-relaxed">
                      <code className="text-[#3182F6] bg-[#E8F3FF] px-1 py-0.5 rounded">
                        user/&#123;user.uid&#125;/links
                      </code>{" "}
                      경로로 오직 나만의 링크들이 안전하게 분리 저장돼요.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3 rounded-2xl bg-[#F8F9FA] p-3 transition hover:bg-[#F2F4F6]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs text-[#3182F6] font-bold text-[13px]">
                    2
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#333D4B]">
                      실시간 링크 추가 · 수정 · 삭제
                    </h3>
                    <p className="text-[12px] text-[#8B95A1] leading-relaxed">
                      영상, 쇼핑, 블로그 카테고리별 아이콘과 뱃지(NEW, 인기 등)를 달아 자유롭게 커스텀할 수 있어요.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3 rounded-2xl bg-[#F8F9FA] p-3 transition hover:bg-[#F2F4F6]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs text-[#3182F6] font-bold text-[13px]">
                    3
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#333D4B]">
                      프로필 정보 화면 커스터마이징
                    </h3>
                    <p className="text-[12px] text-[#8B95A1] leading-relaxed">
                      Google 프로필 사진 및 이름이 기본 연동되며, 소개글과 SNS 링크를 직접 편집해 보여줄 수 있어요.
                    </p>
                  </div>
                </li>
              </ul>
            </section>

            {/* 완성 예시 미리보기 안내 카드 */}
            <section className="rounded-3xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E5E8EB]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-bold text-[#8B95A1]">
                  미리보기 예시 (완성된 화면)
                </span>
                <span className="rounded-md bg-[#E5E8EB] px-2 py-0.5 text-[10px] font-semibold text-[#4E5968]">
                  샘플 뷰
                </span>
              </div>

              {/* 샘플 미니 프로필 카드 */}
              <div className="rounded-2xl border border-[#E5E8EB] bg-[#F8F9FA] p-4 text-center">
                <div className="relative mx-auto h-14 w-14 overflow-hidden rounded-full ring-2 ring-[#3182F6]/30 mb-2">
                  <Image
                    src={DEFAULT_PROFILE.avatarUrl}
                    alt="샘플 아바타"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <h4 className="text-[15px] font-bold text-[#191F28]">지은 JIEUN</h4>
                <p className="text-[12px] text-[#8B95A1] mt-0.5">@jieun_daily</p>
                <p className="text-[12px] text-[#4E5968] mt-2 line-clamp-2 px-2">
                  &quot;일상을 담는 브이로그와 좋아하는 공간을 공유해요 ✨&quot;
                </p>

                {/* 샘플 링크 버튼 2개 */}
                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-xs border border-[#E5E8EB] text-left">
                    <div className="flex items-center gap-2.5">
                      <Video className="h-4 w-4 text-[#3182F6]" />
                      <span className="text-[13px] font-semibold text-[#333D4B]">
                        이번 주 브이로그 보러가기 🎬
                      </span>
                    </div>
                    <span className="rounded bg-[#E8F3FF] px-1.5 py-0.5 text-[10px] font-bold text-[#3182F6]">
                      NEW
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-xs border border-[#E5E8EB] text-left">
                    <div className="flex items-center gap-2.5">
                      <ShoppingBag className="h-4 w-4 text-[#F04452]" />
                      <span className="text-[13px] font-semibold text-[#333D4B]">
                        착장 &amp; 소품 정보 모음 🛍️
                      </span>
                    </div>
                    <span className="rounded bg-[#FFF0F0] px-1.5 py-0.5 text-[10px] font-bold text-[#F04452]">
                      인기
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* ============================================================== */
          /* 케이스 2: 로그인을 했을 때 화면 (마이페이지: user/{user.uid}/links 개인화 화면) */
          /* ============================================================== */
          <div className="flex flex-col gap-4 px-4 pt-3">
            {/* Firestore 개인화 경로 인포메이션 배너 */}
            <div className="flex items-center justify-between rounded-2xl bg-white px-3.5 py-2.5 shadow-xs border border-[#E5E8EB]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex h-2 w-2 rounded-full bg-[#04C056]" />
                <span className="text-[11px] font-medium text-[#6B7684] truncate">
                  경로:{" "}
                  <code className="text-[#3182F6] font-semibold">
                    user/{user.uid.slice(0, 8)}.../links
                  </code>
                </span>
              </div>
              <span className="shrink-0 rounded-full bg-[#E8F3FF] px-2 py-0.5 text-[10px] font-bold text-[#3182F6]">
                마이페이지
              </span>
            </div>

            {/* Profile Card (Firestore user/{user.uid} 문서의 유저 정보 표시) */}
            <section className="rounded-3xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#E5E8EB]">
              <div className="flex flex-col items-center text-center">
                {/* 1:1 Avatar */}
                <div className="relative h-[76px] w-[76px] overflow-hidden rounded-full bg-[#F2F4F6] ring-4 ring-[#E8F3FF] shadow-xs">
                  <Image
                    src={
                      userProfile?.avatarUrl ||
                      user.photoURL ||
                      DEFAULT_PROFILE.avatarUrl
                    }
                    alt={`${userProfile?.displayName || user.email?.split("@")[0] || "유저"} 프로필 사진`}
                    fill
                    sizes="76px"
                    className="object-cover"
                    priority
                  />
                </div>

                {/* 카테고리 / 직군 배지 */}
                <div className="mt-3.5">
                  <span className="inline-flex items-center rounded-full bg-[#F2F4F6] px-3 py-1 text-[12px] font-semibold text-[#4E5968]">
                    {userProfile?.badgeText || "크리에이터 · 링크 관리자"}
                  </span>
                </div>

                {/* 크리에이터 활동명 (Display Name: 이메일 앞부분 기본 사용) */}
                <h1 className="mt-2 text-[20px] font-bold tracking-tight text-[#191F28]">
                  {userProfile?.displayName || user.email?.split("@")[0] || "마이링크 유저"}
                </h1>

                {/* 고유 핸들 / 이메일 (@username) */}
                <p className="mt-0.5 text-[13px] font-medium text-[#8B95A1]">
                  @{userProfile?.username || user.email?.split("@")[0] || "user"}
                </p>

                {/* 한 줄 바이오 (소개글) */}
                <p className="mt-3 max-w-[280px] text-[14px] leading-relaxed text-[#4E5968] break-keep">
                  {userProfile?.bio || "반가워요! 나만의 마이링크 페이지입니다 ✨"}
                </p>

                {/* 프로필 편집 버튼 */}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={openEditModal}
                    type="button"
                    className="flex items-center gap-1.5 rounded-full bg-[#F2F4F6] px-3.5 py-1.5 text-[12px] font-semibold text-[#3182F6] transition hover:bg-[#E8F3FF] active:scale-95"
                    aria-label="프로필 수정"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>프로필 정보 수정</span>
                  </button>
                </div>

                {/* 공식 SNS 아이콘 바 */}
                {userProfile?.socialLinks && userProfile.socialLinks.length > 0 && (
                  <div className="mt-5 w-full border-t border-[#F2F4F6] pt-4">
                    <div className="flex items-center justify-center gap-3">
                      {userProfile.socialLinks.map((item) => (
                        <a
                          key={item.id}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${item.name} 채널로 이동`}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F9FAFB] text-[#4E5968] shadow-xs transition hover:bg-[#F2F4F6] hover:text-[#191F28] hover:scale-110 active:scale-95"
                        >
                          <SocialIcon platform={item.platform} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Links Management Section */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-[17px] font-bold text-[#191F28]">내 링크 목록</h2>
                  <span className="rounded-full bg-[#E5E8EB] px-2 py-0.5 text-[11px] font-bold text-[#4E5968]">
                    {links.length}개
                  </span>
                  {isUpdating && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-[#3182F6] animate-pulse">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      동기화 중...
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleRefresh}
                    disabled={isUpdating || isLinksLoading}
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#4E5968] shadow-xs transition hover:bg-[#E5E8EB] active:scale-95 disabled:opacity-50"
                    title="최신 링크 새로고침"
                    aria-label="새로고침"
                  >
                    <RotateCw className={`h-3.5 w-3.5 ${isUpdating ? "animate-spin" : ""}`} />
                  </button>

                  <button
                    onClick={() => setIsAddLinkDialogOpen(true)}
                    type="button"
                    className="flex items-center gap-1 rounded-full bg-[#3182F6] px-3 py-1.5 text-[13px] font-semibold text-white shadow-xs transition hover:bg-[#1B64DA] active:scale-95"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>링크 추가</span>
                  </button>
                </div>
              </div>

              {/* 링크 목록 */}
              {isLinksLoading ? (
                <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-xs border border-[#E5E8EB]">
                  <Loader2 className="h-6 w-6 animate-spin text-[#3182F6]" />
                  <p className="mt-3 text-[14px] font-medium text-[#8B95A1]">
                    Firestore에서 링크 목록을 불러오는 중...
                  </p>
                </div>
              ) : links.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-10 text-center shadow-xs border border-[#E5E8EB]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F4F6] text-[#8B95A1] mb-3">
                    <LinkIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-[15px] font-bold text-[#191F28]">
                    등록된 링크가 없어요
                  </h3>
                  <p className="mt-1 text-[13px] text-[#8B95A1] max-w-[240px]">
                    상단의 <strong>[+ 링크 추가]</strong> 버튼을 눌러 첫 번째 링크를 등록해보세요!
                  </p>
                  <button
                    onClick={() => setIsAddLinkDialogOpen(true)}
                    type="button"
                    className="mt-4 flex items-center gap-1.5 rounded-full bg-[#3182F6] px-4 py-2 text-[13px] font-bold text-white shadow-xs transition hover:bg-[#1B64DA] active:scale-95"
                  >
                    <Plus className="h-4 w-4" />
                    <span>첫 링크 추가하기</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <LinkCardItem
                      key={link.id}
                      link={link}
                      onCopy={handleCopyLink}
                      onUpdateLink={handleUpdateLink}
                      onDeleteClick={(l) => {
                        setDeletingLink(l);
                        setIsDeleteDialogOpen(true);
                      }}
                      existingUrls={links.map((l) => l.url)}
                      showUrl={true}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* 푸터 */}
        <footer className="mt-12 flex flex-col items-center justify-center px-4 text-center">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[13px] font-bold text-[#8B95A1] transition hover:text-[#4E5968]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#3182F6]" />
            <span>마이링크 (MyLink)</span>
          </Link>
          <p className="mt-1 text-[11px] text-[#B0B8C1]">
            소셜 링크를 하나로 통합하고 손쉽게 공유하세요
          </p>
        </footer>
      </main>

      {/* 링크 추가 모달 다이얼로그 */}
      {user && (
        <AddLinkDialog
          open={isAddLinkDialogOpen}
          onOpenChange={setIsAddLinkDialogOpen}
          onAddLink={handleAddNewLink}
          existingUrls={links.map((l) => l.url)}
        />
      )}

      {/* 링크 삭제 확인 다이얼로그 */}
      {user && (
        <DeleteLinkDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          link={deletingLink}
          onConfirmDelete={handleDeleteLinkConfirm}
        />
      )}

      {/* 프로필 수정 모달 다이얼로그 */}
      {isEditModalOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-[18px] font-bold text-[#191F28] mb-1">
              프로필 정보 수정
            </h3>
            <p className="text-[12px] text-[#8B95A1] mb-4">
              Firestore <code>user/{user.uid.slice(0, 6)}...</code>에 저장됩니다.
            </p>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-3.5">
              <div>
                <label className="text-[12px] font-semibold text-[#4E5968] mb-1 block">
                  활동명 (이름)
                </label>
                <input
                  type="text"
                  value={editForm.displayName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, displayName: e.target.value })
                  }
                  required
                  className="w-full rounded-xl border border-[#E5E8EB] px-3 py-2 text-[14px] text-[#191F28] focus:border-[#3182F6] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#4E5968] mb-1 block">
                  핸들 (@username)
                </label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                  required
                  className="w-full rounded-xl border border-[#E5E8EB] px-3 py-2 text-[14px] text-[#191F28] focus:border-[#3182F6] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#4E5968] mb-1 block">
                  직군 / 뱃지 텍스트
                </label>
                <input
                  type="text"
                  value={editForm.badgeText}
                  onChange={(e) =>
                    setEditForm({ ...editForm, badgeText: e.target.value })
                  }
                  placeholder="예: 크리에이터 · 개발자"
                  className="w-full rounded-xl border border-[#E5E8EB] px-3 py-2 text-[14px] text-[#191F28] focus:border-[#3182F6] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#4E5968] mb-1 block">
                  한 줄 소개 (Bio)
                </label>
                <textarea
                  rows={2}
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E5E8EB] px-3 py-2 text-[14px] text-[#191F28] focus:border-[#3182F6] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#4E5968] mb-1 block">
                  프로필 아바타 이미지 URL
                </label>
                <input
                  type="url"
                  value={editForm.avatarUrl}
                  onChange={(e) =>
                    setEditForm({ ...editForm, avatarUrl: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E5E8EB] px-3 py-2 text-[14px] text-[#191F28] focus:border-[#3182F6] focus:outline-none"
                />
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl bg-[#F2F4F6] px-4 py-2 text-[13px] font-semibold text-[#4E5968] hover:bg-[#E5E8EB]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-xl bg-[#3182F6] px-4 py-2 text-[13px] font-semibold text-white shadow-xs hover:bg-[#1B64DA] disabled:opacity-50"
                >
                  {isUpdating ? "저장 중..." : "저장 완료"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 토스트 알림 */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-3">
          <div className="rounded-full bg-[#191F28]/95 px-4 py-2.5 text-[13px] font-medium text-white shadow-lg backdrop-blur-xs">
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
