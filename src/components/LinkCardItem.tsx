"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  Copy,
  Edit2,
  Trash2,
  Video,
  ShoppingBag,
  Globe,
  MessageCircle,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Check,
  Clock,
} from "lucide-react";
import { LinkItem } from "@/types/profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface LinkCardItemProps {
  link: LinkItem;
  onCopy?: (url: string, title: string) => void;
  onUpdateLink?: (id: string, updated: Partial<Omit<LinkItem, "id">>) => Promise<void>;
  onDeleteClick?: (link: LinkItem) => void;
  existingUrls?: string[];
  className?: string;
  showUrl?: boolean;
}

export function getLinkItemIcon(iconType?: string) {
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

/**
 * 수정된 시각(updatedAtMs)을 읽기 쉬운 상대/절대 시각 문자열로 변환
 */
export function formatUpdatedAt(timestamp?: number): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

const CATEGORY_OPTIONS: {
  value: NonNullable<LinkItem["iconType"]>;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultBadge?: string;
  defaultBadgeColor?: string;
}[] = [
  {
    value: "video",
    label: "영상",
    icon: Video,
    defaultBadge: "NEW",
    defaultBadgeColor: "bg-[#E8F3FF] text-[#3182F6]",
  },
  {
    value: "shopping",
    label: "쇼핑 & 마켓",
    icon: ShoppingBag,
    defaultBadge: "인기",
    defaultBadgeColor: "bg-[#FFF0F0] text-[#F04452]",
  },
  {
    value: "message",
    label: "소통 & 채팅",
    icon: MessageCircle,
    defaultBadge: "소통",
    defaultBadgeColor: "bg-[#E8F3FF] text-[#3182F6]",
  },
  {
    value: "globe",
    label: "블로그 & 웹",
    icon: Globe,
    defaultBadge: "공식",
    defaultBadgeColor: "bg-[#E6F8ED] text-[#04C056]",
  },
  {
    value: "link",
    label: "기타 링크",
    icon: LinkIcon,
    defaultBadge: "추천",
    defaultBadgeColor: "bg-[#F2F4F6] text-[#4E5968]",
  },
];

const PRESET_BADGES = [
  { text: "NEW", color: "bg-[#E8F3FF] text-[#3182F6]" },
  { text: "인기", color: "bg-[#FFF0F0] text-[#F04452]" },
  { text: "EVENT", color: "bg-[#FFF9E6] text-[#FF9E00]" },
  { text: "소통", color: "bg-[#E8F3FF] text-[#3182F6]" },
  { text: "추천", color: "bg-[#F2F4F6] text-[#4E5968]" },
];

export function LinkCardItem({
  link,
  onCopy,
  onUpdateLink,
  onDeleteClick,
  existingUrls = [],
  className,
  showUrl = true,
}: LinkCardItemProps) {
  // 인라인 편집 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // 인라인 편집 폼 상태
  const [editTitle, setEditTitle] = useState(link.title);
  const [editSubtitle, setEditSubtitle] = useState(link.subtitle || "");
  const [editUrl, setEditUrl] = useState(link.url);
  const [editIconType, setEditIconType] = useState<NonNullable<LinkItem["iconType"]>>(
    link.iconType || "link"
  );
  const [editBadge, setEditBadge] = useState(link.badge || "");
  const [editBadgeColor, setEditBadgeColor] = useState(link.badgeColor || "");

  const [touched, setTouched] = useState({
    title: false,
    url: false,
  });

  const handleStartEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditTitle(link.title);
    setEditSubtitle(link.subtitle || "");
    setEditUrl(link.url);
    setEditIconType(link.iconType || "link");
    setEditBadge(link.badge || "");
    setEditBadgeColor(link.badgeColor || "");
    setTouched({ title: false, url: false });
    setSaveError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsEditing(false);
    setSaveError(null);
  };

  // 제목 유효성 검사 (추가 시와 동일한 인증 기준)
  const getTitleError = (val: string): string | null => {
    const trimmed = val.trim();
    if (!trimmed) {
      return "링크 제목을 입력해 주세요.";
    }
    if (trimmed.length < 2) {
      return "제목은 최소 2자 이상 입력해 주세요.";
    }
    if (trimmed.length > 40) {
      return "제목은 최대 40자까지 입력 가능합니다.";
    }
    return null;
  };

  // URL 유효성 검사 (추가 시와 동일한 인증 기준)
  const getUrlError = (val: string): string | null => {
    const trimmed = val.trim();
    if (!trimmed) {
      return "URL을 입력해 주세요.";
    }

    // 1. 보안상 위험한 스킴 차단 (XSS 방지)
    if (/^(javascript|data|vbscript|file):/i.test(trimmed)) {
      return "보안상 허용되지 않는 URL 형식입니다.";
    }

    // 2. 프로토콜 검사 (http:// 또는 https:// 필수)
    if (!/^https?:\/\//i.test(trimmed)) {
      return "http:// 또는 https://로 시작하는 전체 URL을 입력해 주세요.";
    }

    // 3. 브라우저 URL 파싱 검증
    try {
      const parsed = new URL(trimmed);
      if (!parsed.hostname || !parsed.hostname.includes(".")) {
        return "올바른 도메인 주소(예: youtube.com)가 포함되어야 합니다.";
      }
    } catch {
      return "유효한 웹 주소 형식(URL)이 아닙니다.";
    }

    // 4. 중복 URL 확인 (기존 링크 목록과 비교하되, 자기 자신 기존 URL은 제외)
    const normalizedTrimmed = trimmed.toLowerCase().replace(/\/+$/, "");
    const normalizedSelf = link.url.toLowerCase().replace(/\/+$/, "");
    if (normalizedTrimmed !== normalizedSelf) {
      const isDuplicate = existingUrls.some(
        (u) => u.toLowerCase().replace(/\/+$/, "") === normalizedTrimmed
      );
      if (isDuplicate) {
        return "이미 등록되어 있는 URL 주소입니다.";
      }
    }

    return null;
  };

  const titleError = touched.title ? getTitleError(editTitle) : null;
  const isTitleValid = editTitle.trim().length >= 2 && !getTitleError(editTitle);

  const urlError = touched.url ? getUrlError(editUrl) : null;
  const isUrlValid = editUrl.trim().length > 0 && !getUrlError(editUrl);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setTouched({ title: true, url: true });
    setSaveError(null);

    const currentTitleError = getTitleError(editTitle);
    const currentUrlError = getUrlError(editUrl);

    if (currentTitleError || currentUrlError) {
      return;
    }

    if (!onUpdateLink) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      await onUpdateLink(link.id, {
        title: editTitle.trim(),
        subtitle: editSubtitle.trim() || undefined,
        url: editUrl.trim(),
        iconType: editIconType,
        badge: editBadge.trim() || undefined,
        badgeColor: editBadgeColor.trim() || undefined,
      });
      setIsEditing(false);
    } catch (err: unknown) {
      console.error("링크 수정 실패:", err);
      setSaveError((err as Error)?.message || "수정 사항 저장에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  // 인라인 편집 UI 렌더링
  if (isEditing) {
    return (
      <div
        className={cn(
          "relative border-l-4 border-l-[#3182F6] bg-[#F9FAFB] p-5 transition-all",
          className
        )}
      >
        <div className="mb-3.5 flex items-center justify-between border-b border-[#E5E8EB] pb-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E8F3FF] text-[#3182F6]">
                <Edit2 className="h-3.5 w-3.5 stroke-[2.5]" />
              </span>
              <span className="text-[14px] font-bold text-[#191F28]">
                링크 인라인 수정
              </span>
            </div>
            {link.updatedAtMs && (
              <span className="flex items-center gap-1 text-[11px] text-[#8B95A1]">
                <Clock className="h-3 w-3 text-[#B0B8C1]" />
                <span>마지막 수정: {formatUpdatedAt(link.updatedAtMs)}</span>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleCancelEdit}
            disabled={isSaving}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#8B95A1] hover:bg-[#E5E8EB] active:scale-95"
            title="수정 취소"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSaveEdit} className="space-y-3.5 text-left">
          {/* 제목 필드 */}
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-[#4E5968]">
              링크 제목 <span className="text-[#F04452]">*</span>
            </label>
            <div className="relative">
              <Input
                type="text"
                value={editTitle}
                onChange={(e) => {
                  setEditTitle(e.target.value);
                  if (saveError) setSaveError(null);
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
                placeholder="예: 유튜브 채널 바로가기"
                maxLength={40}
                className={cn(
                  "h-10 text-[13px] bg-white transition-all",
                  titleError
                    ? "border-[#F04452] focus-visible:ring-[#F04452]/20"
                    : isTitleValid && touched.title
                    ? "border-[#04C056] focus-visible:ring-[#04C056]/20"
                    : "border-[#E5E8EB] focus-visible:ring-[#3182F6]/20"
                )}
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                {titleError && <AlertCircle className="h-4 w-4 text-[#F04452]" />}
                {isTitleValid && touched.title && (
                  <CheckCircle2 className="h-4 w-4 text-[#04C056]" />
                )}
              </div>
            </div>
            {titleError && (
              <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-[#F04452]">
                {titleError}
              </p>
            )}
          </div>

          {/* URL 필드 */}
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-[#4E5968]">
              URL 링크 주소 <span className="text-[#F04452]">*</span>
            </label>
            <div className="relative">
              <Input
                type="text"
                value={editUrl}
                onChange={(e) => {
                  setEditUrl(e.target.value);
                  if (saveError) setSaveError(null);
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, url: true }))}
                placeholder="https://..."
                className={cn(
                  "h-10 text-[13px] bg-white font-mono transition-all",
                  urlError
                    ? "border-[#F04452] focus-visible:ring-[#F04452]/20"
                    : isUrlValid && touched.url
                    ? "border-[#04C056] focus-visible:ring-[#04C056]/20"
                    : "border-[#E5E8EB] focus-visible:ring-[#3182F6]/20"
                )}
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                {urlError && <AlertCircle className="h-4 w-4 text-[#F04452]" />}
                {isUrlValid && touched.url && (
                  <CheckCircle2 className="h-4 w-4 text-[#04C056]" />
                )}
              </div>
            </div>
            {urlError && (
              <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-[#F04452]">
                {urlError}
              </p>
            )}
          </div>

          {/* 부제목 / 설명 필드 */}
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-[#4E5968]">
              부제목 (설명 문구, 선택)
            </label>
            <Input
              type="text"
              value={editSubtitle}
              onChange={(e) => setEditSubtitle(e.target.value)}
              placeholder="예: 매주 목요일 저녁 8시 신규 영상 업로드"
              className="h-10 text-[13px] bg-white border-[#E5E8EB]"
            />
          </div>

          {/* 카테고리 선택 */}
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[#4E5968]">
              카테고리 / 아이콘
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {CATEGORY_OPTIONS.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = editIconType === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => {
                      setEditIconType(cat.value);
                      if (!editBadge && cat.defaultBadge) {
                        setEditBadge(cat.defaultBadge);
                        setEditBadgeColor(
                          cat.defaultBadgeColor || "bg-[#E8F3FF] text-[#3182F6]"
                        );
                      }
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 rounded-xl p-2 text-center transition-all",
                      isSelected
                        ? "bg-[#3182F6] text-white shadow-sm font-semibold"
                        : "bg-white border border-[#E5E8EB] text-[#4E5968] hover:bg-[#F2F4F6]"
                    )}
                  >
                    <IconComponent className={cn("h-4 w-4", isSelected ? "text-white" : "")} />
                    <span className="text-[10px] truncate max-w-full">
                      {cat.label.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 뱃지 / 태그 선택 */}
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[#4E5968]">
              뱃지 (강조 태그, 선택)
            </label>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {PRESET_BADGES.map((b) => (
                <button
                  key={b.text}
                  type="button"
                  onClick={() => {
                    if (editBadge === b.text) {
                      setEditBadge("");
                      setEditBadgeColor("");
                    } else {
                      setEditBadge(b.text);
                      setEditBadgeColor(b.color);
                    }
                  }}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-medium transition-all",
                    editBadge === b.text
                      ? `${b.color} ring-2 ring-[#3182F6] font-bold shadow-xs`
                      : "bg-white border border-[#E5E8EB] text-[#6B7684] hover:bg-[#F2F4F6]"
                  )}
                >
                  {b.text}
                </button>
              ))}
              {editBadge && (
                <button
                  type="button"
                  onClick={() => {
                    setEditBadge("");
                    setEditBadgeColor("");
                  }}
                  className="text-[11px] text-[#8B95A1] hover:text-[#F04452] underline ml-1"
                >
                  뱃지 제거
                </button>
              )}
            </div>
            <Input
              type="text"
              value={editBadge}
              onChange={(e) => setEditBadge(e.target.value)}
              placeholder="직접 입력 (예: SALE, 1+1, 공지 등)"
              maxLength={10}
              className="h-9 text-[12px] bg-white border-[#E5E8EB]"
            />
          </div>

          {saveError && (
            <div className="rounded-xl bg-[#FFF0F0] p-2.5 text-[12px] font-medium text-[#F04452]">
              {saveError}
            </div>
          )}

          {/* 하단 저장/취소 버튼 */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E8EB]">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="rounded-xl bg-white border border-[#E5E8EB] px-3.5 text-[12px] font-semibold text-[#4E5968] hover:bg-[#F2F4F6]"
            >
              취소
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSaving}
              className="rounded-xl bg-[#3182F6] px-4 text-[12px] font-semibold text-white hover:bg-[#1B64DA] shadow-none"
            >
              {isSaving ? (
                <span className="inline-flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>저장 중...</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>수정 완료</span>
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // 기본 보기 모드 (항상 보이는 수정/삭제 버튼 제공)
  return (
    <div
      className={cn(
        "group relative flex items-center justify-between px-5 py-4 transition-colors hover:bg-neutral-50 active:bg-neutral-100",
        className
      )}
    >
      {/* 카드 링크 본체 (클릭 시 외부 이동) */}
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-w-0 flex-1 items-center gap-3.5 pr-2"
      >
        {/* Icon Avatar */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F2F4F6] transition-transform duration-150 group-hover:scale-105 group-hover:bg-white group-hover:shadow-xs">
          {getLinkItemIcon(link.iconType)}
        </div>

        {/* Text Stack */}
        <div className="min-w-0 flex-1 pr-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-[15px] font-semibold text-[#191F28] transition-colors group-hover:text-[#3182F6]">
              {link.title}
            </span>
            {link.badge && (
              <Badge
                variant="secondary"
                className={cn(
                  "h-5 shrink-0 px-2 text-[10px] font-semibold",
                  link.badgeColor || "bg-[#E8F3FF] text-[#3182F6]"
                )}
              >
                {link.badge}
              </Badge>
            )}
          </div>

          {link.subtitle && (
            <p className="mt-0.5 truncate text-[13px] text-[#8B95A1]">
              {link.subtitle}
            </p>
          )}

          {(showUrl || link.updatedAtMs) && (
            <div className="mt-1 flex items-center flex-wrap gap-x-2 gap-y-0.5 text-[11px]">
              {showUrl && (
                <span className="truncate max-w-[200px] sm:max-w-xs text-[#B0B8C1]">
                  {link.url}
                </span>
              )}
              {showUrl && link.updatedAtMs && (
                <span className="text-[#D1D6DB]">·</span>
              )}
              {link.updatedAtMs && (
                <span className="flex items-center gap-1 text-[#8B95A1] shrink-0">
                  <Clock className="h-3 w-3 text-[#B0B8C1]" />
                  <span>수정 {formatUpdatedAt(link.updatedAtMs)}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </a>

      {/* 우측 액션 버튼 영역 - 요구사항: 항상 표시되도록(opacity-100) 구성 */}
      <div className="flex items-center gap-1 shrink-0 ml-1">
        {/* 복사 버튼 (전달된 경우) */}
        {onCopy && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCopy(link.url, link.title);
            }}
            title="URL 복사"
            className="h-8 w-8 rounded-full text-[#8B95A1] hover:bg-[#E5E8EB] hover:text-[#191F28] active:scale-90 transition-all opacity-100"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        )}

        {/* 수정 버튼 - 항상 표시 */}
        {onUpdateLink && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleStartEdit}
            title="인라인 수정"
            className="h-8 w-8 rounded-full bg-[#E8F3FF]/70 text-[#3182F6] hover:bg-[#E8F3FF] hover:text-[#1B64DA] active:scale-90 transition-all opacity-100"
          >
            <Edit2 className="h-3.5 w-3.5 stroke-[2.2]" />
          </Button>
        )}

        {/* 삭제 버튼 - 항상 표시 */}
        {onDeleteClick && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDeleteClick(link);
            }}
            title="링크 삭제"
            className="h-8 w-8 rounded-full bg-[#FFF0F0]/80 text-[#F04452] hover:bg-[#FFF0F0] hover:text-[#d93845] active:scale-90 transition-all opacity-100"
          >
            <Trash2 className="h-3.5 w-3.5 stroke-[2.2]" />
          </Button>
        )}

        {/* 이동 아이콘 */}
        <ChevronRight className="h-4 w-4 text-[#B0B8C1] transition duration-150 group-hover:translate-x-0.5 group-hover:text-[#3182F6]" />
      </div>
    </div>
  );
}
