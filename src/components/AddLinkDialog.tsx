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
} from "lucide-react";

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLink: (newLink: LinkItem) => void;
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
}: AddLinkDialogProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [url, setUrl] = useState("");
  const [iconType, setIconType] =
    useState<NonNullable<LinkItem["iconType"]>>("link");
  const [badge, setBadge] = useState("");
  const [badgeColor, setBadgeColor] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setUrl("");
    setIconType("link");
    setBadge("");
    setBadgeColor("");
    setUrlError(null);
    setTitleError(null);
  };

  const handleCategorySelect = (category: (typeof CATEGORY_OPTIONS)[0]) => {
    setIconType(category.value);
    if (!badge && category.defaultBadge) {
      setBadge(category.defaultBadge);
      setBadgeColor(category.defaultBadgeColor || "bg-[#E8F3FF] text-[#3182F6]");
    }
  };

  const validateUrl = (value: string): boolean => {
    const trimmed = value.trim();
    if (!trimmed) {
      setUrlError("URL을 입력해 주세요.");
      return false;
    }

    // javascript: 및 data: 스킴 차단 (XSS 방지)
    if (/^(javascript|data):/i.test(trimmed)) {
      setUrlError("보안상 지원되지 않는 URL 형식입니다.");
      return false;
    }

    // http:// 또는 https:// 검증
    if (!/^https?:\/\//i.test(trimmed)) {
      setUrlError("http:// 또는 https://로 시작하는 올바른 URL을 입력해 주세요.");
      return false;
    }

    try {
      new URL(trimmed);
      setUrlError(null);
      return true;
    } catch {
      setUrlError("유효하지 않은 URL 형식입니다.");
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;

    if (!title.trim()) {
      setTitleError("링크 제목을 입력해 주세요.");
      isValid = false;
    } else {
      setTitleError(null);
    }

    if (!validateUrl(url)) {
      isValid = false;
    }

    if (!isValid) return;

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
              <span className="text-[11px] text-[#8B95A1]">{title.length}/40</span>
            </div>
            <Input
              type="text"
              placeholder="예: 이번 주 유튜브 브이로그 🎬"
              value={title}
              maxLength={40}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError(null);
              }}
              className={`h-11 rounded-xl border bg-[#F9FAFB] px-3.5 text-[14px] text-[#191F28] transition-all focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#3182F6] ${
                titleError ? "border-[#F04452] bg-[#FFF0F0]/30" : "border-[#E5E8EB]"
              }`}
            />
            {titleError && (
              <p className="mt-1 flex items-center gap-1 text-[12px] font-medium text-[#F04452]">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{titleError}</span>
              </p>
            )}
          </div>

          {/* 3. 목적지 URL */}
          <div>
            <label className="block text-[13px] font-semibold text-[#4E5968] mb-1">
              목적지 URL <span className="text-[#F04452]">*</span>
            </label>
            <Input
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (urlError) setUrlError(null);
              }}
              onBlur={() => {
                if (url.trim()) validateUrl(url);
              }}
              className={`h-11 rounded-xl border bg-[#F9FAFB] px-3.5 text-[14px] text-[#191F28] transition-all focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#3182F6] ${
                urlError ? "border-[#F04452] bg-[#FFF0F0]/30" : "border-[#E5E8EB]"
              }`}
            />
            {urlError && (
              <p className="mt-1 flex items-center gap-1 text-[12px] font-medium text-[#F04452]">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{urlError}</span>
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
              className="flex-1 rounded-xl bg-[#3182F6] text-[14px] font-semibold text-white shadow-xs hover:bg-[#1B64DA] active:scale-95 h-11 transition-all"
            >
              추가하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
