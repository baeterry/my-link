"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut, Share2, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  onShare?: () => void;
  showShare?: boolean;
}

export function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.19 0 10.04 0 12s.45 3.81 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export function Header({ onShare, showShare = false }: HeaderProps) {
  const { user, userProfile, loading, signInWithGoogle, logout } = useAuth();
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const pathname = usePathname();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      // 사용자가 팝업을 직접 닫은 경우는 경고창 생략
      if (err?.code !== "auth/popup-closed-by-user") {
        console.error("로그인 에러:", error);
        alert("구글 로그인 중 문제가 발생했어요. 다시 시도해주세요.");
      }
    }
  };

  const handleLogout = async () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      try {
        setIsAuthLoading(true);
        await logout();
      } catch (error) {
        console.error("로그아웃 에러:", error);
      } finally {
        setIsAuthLoading(false);
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#E5E8EB]/80 bg-[#F2F4F6]/90 px-4 backdrop-blur-md transition-all sm:px-6">
      <div className="flex items-center gap-2.5">
        <Link
          href="/"
          className="flex items-center gap-2 group transition"
          aria-label="마이링크 홈으로 이동"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#3182F6] text-white shadow-sm transition group-hover:scale-105">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-[17px] font-bold tracking-tight text-[#191F28]">
            마이링크
          </span>
        </Link>

        {pathname === "/links" ? (
          <Link
            href="/"
            className="rounded-full bg-[#E5E8EB] px-2.5 py-1 text-[11px] font-medium text-[#4E5968] transition hover:bg-[#D1D6DB]"
          >
            마이페이지
          </Link>
        ) : (
          <Link
            href="/links"
            className="rounded-full bg-[#E5E8EB] px-2.5 py-1 text-[11px] font-medium text-[#4E5968] transition hover:bg-[#D1D6DB]"
          >
            링크 모아보기
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2">
        {loading || isAuthLoading ? (
          <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-[#8B95A1] shadow-sm">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#3182F6]" />
            <span>처리 중...</span>
          </div>
        ) : user ? (
          // 로그인 완료 상태
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-white py-1 pl-1.5 pr-2.5 shadow-sm border border-[#E5E8EB]">
              {user.photoURL || userProfile?.avatarUrl ? (
                <div className="relative h-6 w-6 overflow-hidden rounded-full ring-1 ring-[#3182F6]/30">
                  <Image
                    src={user.photoURL || userProfile?.avatarUrl || ""}
                    alt="유저 프로필"
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3182F6] text-[11px] font-bold text-white">
                  {(user.email?.split("@")[0] || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden sm:inline-block max-w-[90px] truncate text-[12px] font-medium text-[#333D4B]">
                {userProfile?.displayName || user.email?.split("@")[0] || "유저"}
              </span>
            </div>

            {/* 로그아웃 버튼 */}
            <button
              onClick={handleLogout}
              type="button"
              className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[#8B95A1] shadow-sm border border-[#E5E8EB] transition hover:bg-[#FEECEE] hover:text-[#F04452] active:scale-95"
              title="로그아웃"
              aria-label="로그아웃"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          </div>
        ) : (
          // 미로그인 상태: 구글 로그인 버튼
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-[#333D4B] shadow-sm border border-[#D1D6DB] transition hover:bg-[#F8F9FA] hover:border-[#B0B8C1] active:scale-95"
            aria-label="구글 계정으로 로그인"
          >
            <GoogleIcon className="h-4 w-4" />
            <span>Google 로그인</span>
          </button>
        )}

        {showShare && onShare && (
          <button
            onClick={onShare}
            type="button"
            aria-label="공유하기"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#4E5968] transition hover:bg-[#E5E8EB] active:bg-[#D1D6DB]"
          >
            <Share2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
}
