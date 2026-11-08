"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Copy,
  Check,
  Edit3,
  Plus,
  Layers,
  Home,
  Share2,
  LogOut,
  ShieldCheck,
  Link as LinkIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { GoogleIcon } from "./Header";

interface ProfileDropdownProps {
  onOpenEditProfile?: () => void;
  onOpenAddLink?: () => void;
  onShare?: () => void;
  linksCount?: number;
}

export function ProfileDropdown({
  onOpenEditProfile,
  onOpenAddLink,
  onShare,
  linksCount,
}: ProfileDropdownProps) {
  const { user, userProfile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // 바깥 영역 클릭 시 또는 ESC 키 누르면 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  const emailPrefix = user.email ? user.email.split("@")[0] : "user";
  const displayName = userProfile?.displayName || emailPrefix;
  const username = userProfile?.username || emailPrefix;
  const avatarUrl = user.photoURL || userProfile?.avatarUrl;
  const myLinkUrl = typeof window !== "undefined" ? `${window.location.origin}/@${username}` : `https://mylink.io/@${username}`;

  const handleCopyMyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(myLinkUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleLogout = async () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      setIsOpen(false);
      await logout();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 트리거 버튼 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="사용자 프로필 메뉴 열기"
        className="flex items-center gap-2 rounded-full bg-white py-1 pl-1.5 pr-2.5 shadow-sm border border-[#E5E8EB] transition hover:bg-[#F8F9FA] hover:border-[#D1D6DB] active:scale-95"
      >
        {avatarUrl ? (
          <div className="relative h-6 w-6 overflow-hidden rounded-full ring-1 ring-[#3182F6]/30">
            <Image
              src={avatarUrl}
              alt="프로필 사진"
              fill
              sizes="24px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3182F6] text-[11px] font-bold text-white">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        <span className="max-w-[95px] truncate text-[12px] font-semibold text-[#333D4B]">
          {displayName}
        </span>

        <ChevronDown
          className={`h-3.5 w-3.5 text-[#8B95A1] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 드롭다운 메뉴 본체 */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-3xl bg-white p-4 shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-[#E5E8EB] z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* 1. 유저 계정 정보 카드 */}
          <div className="flex items-center gap-3 pb-3 border-b border-[#F2F4F6]">
            {avatarUrl ? (
              <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-[#E8F3FF] shadow-xs shrink-0">
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3182F6] text-[16px] font-bold text-white shadow-xs shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-[#191F28] truncate">
                  {displayName}
                </span>
                <span className="rounded-md bg-[#E8F3FF] px-1.5 py-0.5 text-[10px] font-semibold text-[#3182F6] shrink-0">
                  {userProfile?.badgeText || "크리에이터"}
                </span>
              </div>
              <span className="text-[12px] text-[#8B95A1] truncate mt-0.5">
                {user.email}
              </span>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-[#04C056] font-medium">
                <GoogleIcon className="h-3 w-3" />
                <span>Google 계정 연동됨</span>
              </div>
            </div>
          </div>

          {/* 2. 내 고유 주소 및 복사 바 */}
          <div className="mt-3 rounded-2xl bg-[#F8F9FA] p-2.5 border border-[#E5E8EB]/80">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#6B7684] mb-1.5">
              <span>내 마이링크 주소</span>
              {isCopied ? (
                <span className="flex items-center gap-1 text-[#04C056] font-semibold">
                  <Check className="h-3 w-3" /> 복사 완료!
                </span>
              ) : (
                <span className="text-[#8B95A1]">클릭하여 복사</span>
              )}
            </div>

            <button
              onClick={handleCopyMyLink}
              type="button"
              className="flex w-full items-center justify-between rounded-xl bg-white px-2.5 py-1.5 shadow-xs border border-[#E5E8EB] transition hover:bg-[#F2F4F6] active:scale-[0.99] text-left"
            >
              <span className="text-[12px] font-semibold text-[#3182F6] truncate">
                @{username}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-medium text-[#6B7684] shrink-0 ml-1">
                {isCopied ? (
                  <Check className="h-3.5 w-3.5 text-[#04C056]" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-[#8B95A1]" />
                )}
                <span>{isCopied ? "복사됨" : "복사"}</span>
              </div>
            </button>
          </div>

          {/* 3. 활동 통계 & 저장소 요약 */}
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#F2F4F6] px-3 py-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-[#4E5968]">
              <LinkIcon className="h-3.5 w-3.5 text-[#3182F6]" />
              <span>등록된 링크</span>
              <span className="font-bold text-[#191F28]">
                {typeof linksCount === "number" ? `${linksCount}개` : "실시간 동기화"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#6B7684]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#04C056]" />
              <span>개인 저장소</span>
            </div>
          </div>

          {/* 4. 빠른 메뉴 액션 리스트 */}
          <div className="mt-3 flex flex-col gap-1 border-t border-[#F2F4F6] pt-2">
            {/* 프로필 정보 수정 */}
            {onOpenEditProfile && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenEditProfile();
                }}
                type="button"
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-[#333D4B] transition hover:bg-[#F2F4F6] active:bg-[#E5E8EB] text-left"
              >
                <Edit3 className="h-4 w-4 text-[#3182F6]" />
                <span>프로필 정보 수정</span>
              </button>
            )}

            {/* 새 링크 바로 추가 */}
            {onOpenAddLink && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAddLink();
                }}
                type="button"
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-[#333D4B] transition hover:bg-[#F2F4F6] active:bg-[#E5E8EB] text-left"
              >
                <Plus className="h-4 w-4 text-[#04C056]" />
                <span>새 링크 바로 추가</span>
              </button>
            )}

            {/* 페이지 네비게이션: 마이페이지 홈 or 링크 모아보기 */}
            {pathname === "/links" ? (
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-[#333D4B] transition hover:bg-[#F2F4F6] active:bg-[#E5E8EB]"
              >
                <Home className="h-4 w-4 text-[#FF9E00]" />
                <span>마이페이지 홈으로 가기</span>
              </Link>
            ) : (
              <Link
                href="/links"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-[#333D4B] transition hover:bg-[#F2F4F6] active:bg-[#E5E8EB]"
              >
                <Layers className="h-4 w-4 text-[#FF9E00]" />
                <span>전체 링크 모아보기 &amp; 검색</span>
              </Link>
            )}

            {/* 프로필 공유하기 */}
            {onShare && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onShare();
                }}
                type="button"
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-[#333D4B] transition hover:bg-[#F2F4F6] active:bg-[#E5E8EB] text-left"
              >
                <Share2 className="h-4 w-4 text-[#8B95A1]" />
                <span>프로필 링크 공유하기</span>
              </button>
            )}
          </div>

          {/* 5. 하단 구분선 및 로그아웃 버튼 */}
          <div className="mt-2 border-t border-[#F2F4F6] pt-2">
            <button
              onClick={handleLogout}
              type="button"
              className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-[13px] font-semibold text-[#F04452] transition hover:bg-[#FEECEE] active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>로그아웃</span>
              </div>
              <span className="text-[11px] font-normal text-[#B0B8C1]">
                세션 종료
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
