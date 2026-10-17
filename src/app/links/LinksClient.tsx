"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Sparkles,
  Layers,
  Filter,
  Plus,
  Loader2,
  RotateCw,
} from "lucide-react";
import { LinkItem, DEFAULT_PROFILE, ProfileData } from "@/types/profile";
import { DUMMY_LINKS } from "../../../data/links";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LinkCardItem } from "@/components/LinkCardItem";
import { CategoryFilterTabs } from "@/components/CategoryFilterTabs";
import { AddLinkDialog } from "@/components/AddLinkDialog";
import {
  addLinkToFirestore,
  getLinksFromFirestore,
  subscribeLinksFromFirestore,
} from "@/lib/firestoreLinks";

const STORAGE_KEY = "mylink_profile_data";

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
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLinksLoading, setIsLinksLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: ProfileData = JSON.parse(saved);
        setProfile((prev) => ({
          ...prev,
          displayName: parsed.displayName ?? prev.displayName,
          username: parsed.username ?? prev.username,
          badgeText: parsed.badgeText ?? prev.badgeText,
          avatarUrl: parsed.avatarUrl ?? prev.avatarUrl,
          bio: parsed.bio ?? prev.bio,
          socialLinks: parsed.socialLinks ?? prev.socialLinks,
          contactEmail: parsed.contactEmail ?? prev.contactEmail,
        }));
      }
    } catch (e) {
      console.error("데이터 로드 실패:", e);
    } finally {
      setIsLoaded(true);
    }

    // Firestore 'users/anonymous/links' 실시간 동기화 (createdAt 기준 최신순 정렬)
    setIsLinksLoading(true);
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = subscribeLinksFromFirestore(
        (firestoreLinks) => {
          setLinks(firestoreLinks);
          setProfile((prev) => {
            const updated = { ...prev, links: firestoreLinks };
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch {}
            return updated;
          });
          setIsLinksLoading(false);
          setIsUpdating(false);
        },
        (err) => {
          console.warn("Firestore 실시간 연동 에러:", err);
          setIsLinksLoading(false);
          setIsUpdating(false);
        }
      );
    } catch (err) {
      console.warn("Firestore 구독 초기화 실패:", err);
      setIsLinksLoading(false);
      setIsUpdating(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // 수동 새로고침
  const handleRefresh = async () => {
    if (isUpdating || isLinksLoading) return;
    try {
      setIsUpdating(true);
      const latestLinks = await getLinksFromFirestore();
      setLinks(latestLinks);
      setProfile((prev) => {
        const updated = { ...prev, links: latestLinks };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
      showToast("최신 링크 목록으로 갱신되었어요 ✨");
    } catch (e) {
      console.error("새로고침 실패:", e);
      showToast("목록 갱신에 실패했어요");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddLink = async (newLink: LinkItem) => {
    try {
      setIsUpdating(true);
      const savedLink = await addLinkToFirestore(newLink);

      setLinks((prev) => {
        const exists = prev.some((l) => l.id === savedLink.id);
        const updated = exists ? prev : [savedLink, ...prev];
        return updated;
      });

      setProfile((prev) => {
        const exists = prev.links.some((l) => l.id === savedLink.id);
        const updatedLinks = exists ? prev.links : [savedLink, ...prev.links];
        const updatedProfile = { ...prev, links: updatedLinks };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
        } catch {}
        return updatedProfile;
      });

      showToast("새 링크가 Firestore에 성공적으로 저장되었어요 🚀");
    } catch (e: any) {
      console.error("Firestore 링크 저장 실패:", e);
      showToast("Firestore 링크 추가에 실패했어요");
      throw e;
    } finally {
      setTimeout(() => {
        setIsUpdating(false);
      }, 500);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const handleCopyLink = (url: string, title: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast(`'${title}' 링크 주소가 복사되었어요 📋`);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        navigator
          .share({
            title: `${profile.displayName}의 전체 링크 목록 - 마이링크`,
            text: `${profile.displayName}님의 추천 및 공식 링크 모음입니다.`,
            url: window.location.href,
          })
          .catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast("페이지 링크가 복사되었어요 ✨");
      }
    }
  };

  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      if (selectedCategory !== "all") {
        if (selectedCategory === "link") {
          if (link.iconType && link.iconType !== "link") return false;
        } else {
          if (link.iconType !== selectedCategory) return false;
        }
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = link.title?.toLowerCase().includes(q);
      const matchSubtitle = link.subtitle?.toLowerCase().includes(q);
      const matchBadge = link.badge?.toLowerCase().includes(q);
      const matchUrl = link.url?.toLowerCase().includes(q);

      return matchTitle || matchSubtitle || matchBadge || matchUrl;
    });
  }, [links, searchQuery, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<FilterCategory, number> = {
      all: links.length,
      video: 0,
      shopping: 0,
      message: 0,
      globe: 0,
      link: 0,
    };

    links.forEach((link) => {
      if (link.iconType === "video") counts.video++;
      else if (link.iconType === "shopping") counts.shopping++;
      else if (link.iconType === "message") counts.message++;
      else if (link.iconType === "globe") counts.globe++;
      else counts.link++;
    });

    return counts;
  }, [links]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2F4F6]">
        <div className="text-[15px] font-medium text-[#8B95A1]">링크 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#F2F4F6] pb-24 text-[#191F28] antialiased">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between bg-[#F2F4F6]/90 px-4 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-[#4E5968] hover:bg-[#E5E8EB] active:scale-95"
            render={<Link href="/" />}
            aria-label="홈으로 돌아가기"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-[17px] font-bold tracking-tight text-[#191F28]">
            링크 목록
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            onClick={() => setIsAddLinkDialogOpen(true)}
            className="flex items-center gap-1 rounded-full bg-[#3182F6] px-3 h-8 text-[12px] font-semibold text-white shadow-xs hover:bg-[#1B64DA] active:scale-95 transition-all"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>추가</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            aria-label="공유하기"
            className="h-9 w-9 rounded-full text-[#4E5968] hover:bg-[#E5E8EB] active:scale-95"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-3.5 px-4 pt-2">
        {/* Profile Summary Card */}
        <Card className="rounded-2xl border-none bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-0">
          <CardContent className="flex items-center justify-between p-0">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F3FF] text-[#3182F6]">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-bold text-[#191F28]">
                    {profile.displayName}
                  </span>
                  <Badge variant="secondary" className="rounded-md bg-[#F2F4F6] px-1.5 py-0.5 text-[10px] font-medium text-[#6B7684]">
                    @{profile.username}
                  </Badge>
                </div>
                <p className="text-[12px] text-[#8B95A1] mt-0.5">
                  총 <strong className="text-[#3182F6] font-semibold">{links.length}개</strong>의 링크가 등록되어 있어요
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl bg-[#F2F4F6] px-3 text-[12px] font-semibold text-[#4E5968] hover:bg-[#E5E8EB] active:scale-95"
              render={<Link href="/" />}
            >
              프로필 보기
            </Button>
          </CardContent>
        </Card>

        {/* Search Input Bar (Using shadcn Input) */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B95A1] z-10" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="링크 제목, 설명 또는 태그 검색..."
            className="h-11 w-full rounded-2xl border-none bg-white pl-10 pr-10 text-[14px] text-[#191F28] shadow-[0_2px_8px_rgba(0,0,0,0.04)] placeholder:text-[#8B95A1] focus-visible:ring-2 focus-visible:ring-[#3182F6] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[11px] font-bold text-[#8B95A1] hover:bg-[#F2F4F6] cursor-pointer z-10"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter Pills (Reusable CategoryFilterTabs Component) */}
        <CategoryFilterTabs
          tabs={CATEGORY_TABS}
          selected={selectedCategory}
          counts={categoryCounts}
          onSelect={setSelectedCategory}
        />

        {/* Link List Section */}
        <section className="overflow-hidden rounded-3xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-[#F2F4F6]">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-bold text-[#191F28]">
                {selectedCategory === "all" ? "전체 링크" : CATEGORY_TABS.find((t) => t.key === selectedCategory)?.label}
              </h2>
              <Badge variant="secondary" className="rounded-full bg-[#E8F3FF] px-2 py-0.5 text-[11px] font-bold text-[#3182F6]">
                {filteredLinks.length}
              </Badge>
              {isUpdating && !isLinksLoading && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F3FF] px-2 py-0.5 text-[11px] font-semibold text-[#3182F6] animate-in fade-in duration-200">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>동기화 중...</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isUpdating || isLinksLoading}
                aria-label="목록 새로고침"
                className="flex h-7 w-7 items-center justify-center rounded-full text-[#8B95A1] transition hover:bg-[#F2F4F6] hover:text-[#4E5968] active:scale-95 disabled:opacity-40"
                title="목록 새로고침"
              >
                <RotateCw className={`h-3.5 w-3.5 ${isUpdating ? "animate-spin text-[#3182F6]" : ""}`} />
              </button>

              <button
                type="button"
                onClick={() => setIsAddLinkDialogOpen(true)}
                className="flex items-center gap-1 rounded-full bg-[#E8F3FF] px-2.5 py-1 text-[12px] font-semibold text-[#3182F6] hover:bg-[#d6e9ff] transition-colors active:scale-95"
              >
                <Plus className="h-3 w-3 stroke-[2.5]" />
                <span>링크 추가</span>
              </button>
              {searchQuery && (
                <span className="text-[12px] text-[#8B95A1] ml-1">
                  검색결과
                </span>
              )}
            </div>
          </div>

          {/* 갱신/업데이트 진행 시 상단에 표시되는 얇은 인디케이터 바 */}
          {isUpdating && !isLinksLoading && (
            <div className="h-0.5 w-full bg-[#E8F3FF] overflow-hidden">
              <div className="h-full w-full bg-[#3182F6] animate-pulse" />
            </div>
          )}

          <div className="divide-y divide-[#F2F4F6]">
            {isLinksLoading ? (
              <div className="py-14 flex flex-col items-center justify-center text-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#3182F6]" />
                <p className="mt-2 text-[13px] font-medium text-[#8B95A1]">
                  Firestore에서 링크를 불러오는 중...
                </p>
              </div>
            ) : filteredLinks.length > 0 ? (
              filteredLinks.map((link) => (
                <LinkCardItem
                  key={link.id}
                  link={link}
                  onCopy={handleCopyLink}
                />
              ))
            ) : (
              <div className="py-14 text-center px-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F4F6] text-[#8B95A1] mb-3">
                  <Filter className="h-5 w-5" />
                </div>
                <p className="text-[15px] font-semibold text-[#191F28]">
                  {searchQuery || selectedCategory !== "all"
                    ? "일치하는 링크가 없어요"
                    : "등록된 링크가 아직 없어요"}
                </p>
                <p className="mt-1 text-[13px] text-[#8B95A1]">
                  {searchQuery || selectedCategory !== "all"
                    ? "검색어를 변경하거나 필터를 초기화해보세요."
                    : "우측 상단 [+ 추가] 버튼으로 첫 번째 링크를 등록해보세요."}
                </p>
                {(searchQuery || selectedCategory !== "all") && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="mt-4 rounded-xl bg-[#E8F3FF] text-[13px] font-semibold text-[#3182F6] hover:bg-[#d6e9ff] active:scale-95"
                  >
                    전체 링크 보기
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Bottom Banner */}
        <Card className="rounded-2xl border border-[#E5E8EB] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] ring-0">
          <CardContent className="flex items-center justify-between p-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF9E6] text-[#FF9E00]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#191F28]">나만의 링크트리 만들기</p>
                <p className="text-[11px] text-[#8B95A1]">3분 만에 모든 SNS와 링크를 통합하세요</p>
              </div>
            </div>
            <Button
              size="sm"
              className="rounded-xl bg-[#3182F6] px-3.5 text-[12px] font-bold text-white shadow-xs hover:bg-[#1B64DA] active:scale-95 transition-all"
              render={<Link href="/" />}
            >
              시작하기
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-2 py-6 text-center text-[12px] text-[#8B95A1]">
          <p className="font-medium text-[#4E5968]">마이링크 (MyLink)</p>
          <p className="mt-0.5">토스 디자인 시스템(TDS) & shadcn/ui 기반 단일 링크 플랫폼</p>
        </footer>
      </div>

      {/* TDS Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-[#191F28] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.2)] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-[#04C056]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 새 링크 추가 다이얼로그 (Dialog) */}
      <AddLinkDialog
        open={isAddLinkDialogOpen}
        onOpenChange={setIsAddLinkDialogOpen}
        onAddLink={handleAddLink}
        existingUrls={links.map((l) => l.url)}
      />
    </main>
  );
}
