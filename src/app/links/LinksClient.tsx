"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ArrowLeft,
  Sparkles,
  Plus,
  Loader2,
  RotateCw,
  Link as LinkIcon,
  ShieldCheck,
} from "lucide-react";
import { LinkItem } from "@/types/profile";
import { LinkCardItem } from "@/components/LinkCardItem";
import { AddLinkDialog } from "@/components/AddLinkDialog";
import { DeleteLinkDialog } from "@/components/DeleteLinkDialog";
import { Header, GoogleIcon } from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import {
  addLinkToFirestore,
  getLinksFromFirestore,
  subscribeLinksFromFirestore,
  updateLinkInFirestore,
  deleteLinkFromFirestore,
} from "@/lib/firestoreLinks";

type FilterCategory = "all" | "video" | "shopping" | "message" | "globe" | "link";

const CATEGORY_TABS: { key: FilterCategory; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "video", label: "영상" },
  { key: "shopping", label: "쇼핑 & 마켓" },
  { key: "message", label: "소통 & 커뮤니티" },
  { key: "globe", label: "블로그 & 웹" },
  { key: "link", label: "기타 링크" },
];

export default function LinksClient() {
  const { user, userProfile, loading: authLoading, signInWithGoogle } = useAuth();

  const [links, setLinks] = useState<LinkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLinksLoading, setIsLinksLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // 모달 다이얼로그 상태
  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = useState(false);
  const [deletingLink, setDeletingLink] = useState<LinkItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Firestore user/{user.uid}/links 실시간 동기화
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

  // 검색 및 카테고리 필터링
  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      // 카테고리 필터
      const matchCategory =
        selectedCategory === "all" ||
        (selectedCategory === "link"
          ? !link.iconType || link.iconType === "link"
          : link.iconType === selectedCategory);

      // 검색어 필터
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        link.title.toLowerCase().includes(q) ||
        (link.subtitle && link.subtitle.toLowerCase().includes(q)) ||
        link.url.toLowerCase().includes(q) ||
        (link.badge && link.badge.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [links, selectedCategory, searchQuery]);

  // 카테고리별 개수 카운트
  const categoryCounts = useMemo(() => {
    const counts: Record<FilterCategory, number> = {
      all: links.length,
      video: 0,
      shopping: 0,
      message: 0,
      globe: 0,
      link: 0,
    };
    links.forEach((l) => {
      const type = (l.iconType || "link") as FilterCategory;
      if (counts[type] !== undefined) {
        counts[type]++;
      } else {
        counts.link++;
      }
    });
    return counts;
  }, [links]);

  const handleCopy = (url: string, title: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast(`'${title}' 링크 주소가 복사되었어요 📋`);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const shareTitle = userProfile?.displayName || user?.displayName || "마이링크";
      if (navigator.share) {
        navigator
          .share({
            title: `${shareTitle} - 전체 링크 목록`,
            url: window.location.href,
          })
          .catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast("링크가 복사되었어요 📋");
      }
    }
  };

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

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2F4F6]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#3182F6]" />
          <div className="text-[15px] font-medium text-[#4E5968]">
            링크 목록을 준비하는 중이에요...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F4F6]">
      <Header onShare={handleShare} showShare={!!user} />

      <main className="relative mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-md flex-col pb-24 text-[#191F28] antialiased">
        {/* 미로그인 상태 안내 화면 */}
        {!user ? (
          <div className="flex flex-col gap-5 px-4 pt-8">
            <section className="overflow-hidden rounded-3xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E5E8EB] text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F3FF] text-[#3182F6] mx-auto mb-4">
                <Sparkles className="h-8 w-8" />
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F3FF] px-3 py-1 text-[12px] font-semibold text-[#3182F6] mb-3">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>로그인 필요 안내</span>
              </div>

              <h1 className="text-[20px] font-bold tracking-tight text-[#191F28] mb-2 leading-snug">
                로그인 후 나만의 링크를
                <br />
                검색하고 관리해보세요
              </h1>

              <p className="text-[13px] leading-relaxed text-[#6B7684] mb-6">
                Google 계정으로 로그인하면
                <br />
                <code className="text-[#3182F6] bg-[#E8F3FF] px-1 py-0.5 rounded font-mono text-[12px]">
                  user/&#123;user.uid&#125;/links
                </code>{" "}
                개인화 저장소의
                <br />
                모든 링크를 카테고리별로 모아보고 검색할 수 있어요.
              </p>

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

              <div className="mt-4">
                <Link
                  href="/"
                  className="text-[13px] font-semibold text-[#4E5968] hover:text-[#191F28] underline underline-offset-4"
                >
                  마이페이지로 돌아가기
                </Link>
              </div>
            </section>
          </div>
        ) : (
          /* 로그인 상태의 개인화 링크 목록 화면 */
          <div className="flex flex-col gap-4 px-4 pt-3">
            {/* 상단 네비게이션 & 타이틀 바 */}
            <div className="flex items-center justify-between rounded-2xl bg-white px-3.5 py-2.5 shadow-xs border border-[#E5E8EB]">
              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[#4E5968] hover:bg-[#F2F4F6]"
                  aria-label="마이페이지로 돌아가기"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <span className="text-[13px] font-bold text-[#191F28]">
                  {userProfile?.displayName || user.email?.split("@")[0] || "내"} 링크 모아보기
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleRefresh}
                  disabled={isUpdating || isLinksLoading}
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[#4E5968] hover:bg-[#F2F4F6] disabled:opacity-50"
                  title="새로고침"
                  aria-label="새로고침"
                >
                  <RotateCw className={`h-3.5 w-3.5 ${isUpdating ? "animate-spin" : ""}`} />
                </button>

                <button
                  onClick={() => setIsAddLinkDialogOpen(true)}
                  type="button"
                  className="flex items-center gap-1 rounded-full bg-[#3182F6] px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs hover:bg-[#1B64DA]"
                >
                  <Plus className="h-3 w-3" />
                  <span>추가</span>
                </button>
              </div>
            </div>

            {/* 검색창 */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B95A1]" />
              <input
                type="text"
                placeholder="제목, 태그, URL 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-[#E5E8EB] bg-white py-2.5 pl-10 pr-4 text-[14px] text-[#191F28] placeholder-[#8B95A1] shadow-xs focus:border-[#3182F6] focus:outline-none"
              />
            </div>

            {/* 카테고리 필터 탭 */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {CATEGORY_TABS.map((tab) => {
                const count = categoryCounts[tab.key] || 0;
                const isSelected = selectedCategory === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSelectedCategory(tab.key)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition active:scale-95 ${
                      isSelected
                        ? "bg-[#191F28] text-white shadow-xs"
                        : "bg-white text-[#6B7684] border border-[#E5E8EB] hover:bg-[#F2F4F6]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                        isSelected ? "bg-white/20 text-white" : "bg-[#F2F4F6] text-[#8B95A1]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 링크 카드 리스트 */}
            {isLinksLoading ? (
              <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-xs border border-[#E5E8EB]">
                <Loader2 className="h-6 w-6 animate-spin text-[#3182F6]" />
                <p className="mt-3 text-[14px] font-medium text-[#8B95A1]">
                  Firestore에서 링크를 불러오는 중...
                </p>
              </div>
            ) : filteredLinks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-10 text-center shadow-xs border border-[#E5E8EB]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F4F6] text-[#8B95A1] mb-3">
                  <LinkIcon className="h-6 w-6" />
                </div>
                <h3 className="text-[15px] font-bold text-[#191F28]">
                  {searchQuery ? "검색 결과가 없어요" : "등록된 링크가 없어요"}
                </h3>
                <p className="mt-1 text-[13px] text-[#8B95A1]">
                  {searchQuery
                    ? "다른 검색어로 다시 검색해보세요."
                    : "새로운 링크를 등록해 나만의 컬렉션을 완성해보세요."}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setIsAddLinkDialogOpen(true)}
                    type="button"
                    className="mt-4 flex items-center gap-1.5 rounded-full bg-[#3182F6] px-4 py-2 text-[13px] font-bold text-white shadow-xs hover:bg-[#1B64DA]"
                  >
                    <Plus className="h-4 w-4" />
                    <span>링크 추가하기</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {filteredLinks.map((link) => (
                  <LinkCardItem
                    key={link.id}
                    link={link}
                    onCopy={handleCopy}
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
            Firestore 개인화 경로: user/&#123;user.uid&#125;/links
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
