"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LinkItem } from "@/types/profile";
import {
  Video,
  ShoppingBag,
  MessageCircle,
  Globe,
  Link as LinkIcon,
  Plus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLink: (newLink: LinkItem) => void;
  existingUrls?: string[];
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

export function AddLinkDialog({
  open,
  onOpenChange,
  onAddLink,
  existingUrls = [],
}: AddLinkDialogProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [url, setUrl] = useState("");
  const [iconType, setIconType] =
    useState<NonNullable<LinkItem["iconType"]>>("link");
  const [badge, setBadge] = useState("");
  const [badgeColor, setBadgeColor] = useState("");

  // 필드 터치(포커스 해제) 여부 추적
  const [touched, setTouched] = useState({
    title: false,
    url: false,
  });

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setUrl("");
    setIconType("link");
    setBadge("");
    setBadgeColor("");
    setTouched({ title: false, url: false });
  };

  const handleCategorySelect = (category: (typeof CATEGORY_OPTIONS)[0]) => {
    setIconType(category.value);
    if (!badge && category.defaultBadge) {
      setBadge(category.defaultBadge);
      setBadgeColor(category.defaultBadgeColor || "bg-[#E8F3FF] text-[#3182F6]");
    }
  };

  // 제목 유효성 검사 함수
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

  // URL 유효성 검사 함수
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

    // 4. 중복 URL 확인 (기존 링크 목록과 비교)
    const isDuplicate = existingUrls.some(
      (u) => u.toLowerCase().replace(/\/+$/, "") === trimmed.toLowerCase().replace(/\/+$/, "")
    );
    if (isDuplicate) {
      return "이미 등록되어 있는 URL 주소입니다.";
    }

    return null;
  };

  const titleError = touched.title ? getTitleError(title) : null;
  const isTitleValid = title.trim().length >= 2 && !getTitleError(title);

  const urlError = touched.url ? getUrlError(url) : null;
  const isUrlValid = url.trim().length > 0 && !getUrlError(url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ title: true, url: true });

    const currentTitleError = getTitleError(title);
    const currentUrlError = getUrlError(url);

    if (currentTitleError || currentUrlError) {
      return;
    }

    const newLink: LinkItem = {
      id: "link-" + Date.now(),
      title: title.trim(),
      subtitle: subtitle.trim() ? subtitle.trim() : undefined,
      url: url.trim(),
      iconType,
      badge: badge.trim() ? badge.trim() : undefined,
      badgeColor: badge.trim()
        ? badgeColor || "bg-[#E8F3FF] text-[#3182F6]"
        : undefined,
    };

    onAddLink(newLink);
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) resetForm();
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border-none">
        <DialogHeader className="gap-1 text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8F3FF] text-[#3182F6]">
              <Plus className="h-4 w-4 stroke-[3]" />
            </div>
            <DialogTitle className="text-[18px] font-bold tracking-tight text-[#191F28]">
              새 링크 추가
            </DialogTitle>
          </div>
          <DialogDescription className="text-[13px] text-[#8B95A1]">
            프로필과 전체 목록에 노출될 새로운 링크를 로컬 상태에 등록합니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          {/* 1. 카테고리 (아이콘 타입) 선택 */}
          <div>
            <label className="block text-[13px] font-semibold text-[#4E5968] mb-1.5">
              카테고리 선택
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {CATEGORY_OPTIONS.map((cat) => {
                const Icon = cat.icon;
                const isSelected = iconType === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-xl p-2 text-center transition-all ${
                      isSelected
                        ? "bg-[#E8F3FF] text-[#3182F6] ring-2 ring-[#3182F6] font-bold"
                        : "bg-[#F9FAFB] text-[#6B7684] hover:bg-[#F2F4F6] hover:text-[#191F28]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-[11px] leading-tight">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. 링크 제목 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[13px] font-semibold text-[#4E5968]">
                링크 제목 <span className="text-[#F04452]">*</span>
              </label>
              <span className={`text-[11px] ${title.length >= 40 ? "text-[#F04452] font-semibold" : "text-[#8B95A1]"}`}>
                {title.length}/40
              </span>
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="예: 이번 주 유튜브 브이로그 🎬"
                value={title}
                maxLength={40}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
                className={`h-11 rounded-xl border bg-[#F9FAFB] px-3.5 text-[14px] text-[#191F28] transition-all focus-visible:bg-white focus-visible:ring-2 ${
                  titleError
                    ? "border-[#F04452] bg-[#FFF0F0]/20 focus-visible:ring-[#F04452]"
                    : isTitleValid && touched.title
                    ? "border-[#04C056]/50 focus-visible:ring-[#04C056]"
                    : "border-[#E5E8EB] focus-visible:ring-[#3182F6]"
                } pr-10`}
              />
              {touched.title && (
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
                  {titleError ? (
                    <AlertCircle className="h-4 w-4 text-[#F04452]" />
                  ) : isTitleValid ? (
                    <CheckCircle2 className="h-4 w-4 text-[#04C056]" />
                  ) : null}
                </div>
              )}
            </div>
            {titleError ? (
              <p className="mt-1.5 flex items-center gap-1 text-[12px] font-medium text-[#F04452] animate-in fade-in duration-150">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{titleError}</span>
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-[#8B95A1]">
                버튼에 강조되어 노출될 텍스트입니다. (최소 2자 이상)
              </p>
            )}
          </div>

          {/* 3. 목적지 URL */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[13px] font-semibold text-[#4E5968]">
                목적지 URL <span className="text-[#F04452]">*</span>
              </label>
              {url.trim() && !urlError && touched.url && (
                <span className="text-[11px] font-medium text-[#04C056]">
                  정상적인 웹 주소
                </span>
              )}
            </div>
            <div className="relative">
              <Input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, url: true }))}
                className={`h-11 rounded-xl border bg-[#F9FAFB] px-3.5 text-[14px] text-[#191F28] transition-all focus-visible:bg-white focus-visible:ring-2 ${
                  urlError
                    ? "border-[#F04452] bg-[#FFF0F0]/20 focus-visible:ring-[#F04452]"
                    : isUrlValid && touched.url
                    ? "border-[#04C056]/50 focus-visible:ring-[#04C056]"
                    : "border-[#E5E8EB] focus-visible:ring-[#3182F6]"
                } pr-10`}
              />
              {touched.url && (
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
                  {urlError ? (
                    <AlertCircle className="h-4 w-4 text-[#F04452]" />
                  ) : isUrlValid ? (
                    <CheckCircle2 className="h-4 w-4 text-[#04C056]" />
                  ) : null}
                </div>
              )}
            </div>
            {urlError ? (
              <p className="mt-1.5 flex items-center gap-1 text-[12px] font-medium text-[#F04452] animate-in fade-in duration-150">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{urlError}</span>
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-[#8B95A1]">
                https:// 또는 http://를 포함한 전체 주소를 입력하세요.
              </p>
            )}
          </div>

          {/* 4. 부제목 / 설명 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[13px] font-semibold text-[#4E5968]">
                설명 / 부제목 <span className="text-[11px] font-normal text-[#8B95A1]">(선택)</span>
              </label>
              <span className="text-[11px] text-[#8B95A1]">{subtitle.length}/60</span>
            </div>
            <Input
              type="text"
              placeholder="예: 가을맞이 인테리어 룸투어 영상 보러가기"
              value={subtitle}
              maxLength={60}
              onChange={(e) => setSubtitle(e.target.value)}
              className="h-11 rounded-xl border border-[#E5E8EB] bg-[#F9FAFB] px-3.5 text-[14px] text-[#191F28] transition-all focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#3182F6]"
            />
          </div>

          {/* 5. 배지 태그 */}
          <div>
            <label className="block text-[13px] font-semibold text-[#4E5968] mb-1.5">
              배지 태그 <span className="text-[11px] font-normal text-[#8B95A1]">(선택)</span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {PRESET_BADGES.map((preset) => {
                const isSelected = badge === preset.text;
                return (
                  <button
                    key={preset.text}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setBadge("");
                        setBadgeColor("");
                      } else {
                        setBadge(preset.text);
                        setBadgeColor(preset.color);
                      }
                    }}
                    className={`cursor-pointer transition-transform active:scale-95 ${
                      isSelected ? "scale-105" : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Badge
                      variant="secondary"
                      className={`h-6 rounded-lg px-2 text-[11px] font-semibold ${
                        preset.color
                      } ${isSelected ? "ring-2 ring-offset-1 ring-[#3182F6]" : ""}`}
                    >
                      {preset.text}
                    </Badge>
                  </button>
                );
              })}
            </div>
            <Input
              type="text"
              placeholder="직접 입력 (예: HOT, 마감임박)"
              value={badge}
              maxLength={15}
              onChange={(e) => {
                setBadge(e.target.value);
                if (!badgeColor) {
                  setBadgeColor("bg-[#E8F3FF] text-[#3182F6]");
                }
              }}
              className="h-9 rounded-xl border border-[#E5E8EB] bg-[#F9FAFB] px-3 text-[13px] text-[#191F28] transition-all focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#3182F6]"
            />
          </div>

          <DialogFooter className="-mx-5 sm:-mx-6 -mb-5 sm:-mb-6 mt-6 flex-row gap-2 border-t border-[#F2F4F6] bg-[#F9FAFB] px-5 sm:px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              className="flex-1 rounded-xl border-[#E5E8EB] bg-white text-[14px] font-semibold text-[#4E5968] hover:bg-[#F2F4F6] h-11"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={(touched.title && !isTitleValid) || (touched.url && !isUrlValid)}
              className="flex-1 rounded-xl bg-[#3182F6] text-[14px] font-semibold text-white shadow-xs hover:bg-[#1B64DA] active:scale-95 disabled:opacity-50 disabled:pointer-events-none h-11 transition-all"
            >
              추가하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
