"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Globe,
  Briefcase,
  ChevronRight,
  CheckCircle2,
  Share2,
} from "lucide-react";

// Clean inline Github SVG icon matching TDS stroke style
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Home() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@example.com");
    showToast("이메일 주소가 복사되었어요");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "baeterry 프로필",
        text: "프론트엔드 개발자 baeterry의 프로필이에요.",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("프로필 링크가 복사되었어요");
    }
  };

  const links = [
    {
      id: "github",
      title: "GitHub 저장소",
      subtitle: "@baeterry의 소스코드와 활동 내역을 확인해요",
      url: "https://github.com/baeterry",
      icon: GithubIcon,
      badge: "메인",
      badgeColor: "bg-[#E8F3FF] text-[#3182F6]",
    },
    {
      id: "blog",
      title: "기술 블로그 & 기록",
      subtitle: "배운 내용과 문제 해결 과정을 정리해요",
      url: "https://github.com/baeterry",
      icon: Globe,
    },
    {
      id: "portfolio",
      title: "포트폴리오 프로젝트",
      subtitle: "직접 개발한 웹 서비스를 모아봤어요",
      url: "https://github.com/baeterry",
      icon: Briefcase,
    },
  ];

  const techChips = [
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Git",
  ];

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#F2F4F6] pb-28 text-[#191F28] antialiased">
      
      {/* TDS Top App Bar (56pt) */}
      <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between bg-[#F2F4F6]/90 px-5 backdrop-blur-md">
        <span className="text-[17px] font-bold tracking-tight text-[#191F28]">
          프로필
        </span>
        <button
          onClick={handleShare}
          type="button"
          aria-label="공유하기"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#4E5968] transition hover:bg-[#E5E8EB] active:bg-[#D1D6DB]"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col gap-4 px-4 pt-2">
        
        {/* Profile Hero Card (TDS Elevated Card #FFFFFF) */}
        <section className="rounded-3xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-4">
            {/* Avatar (64px) */}
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#F2F4F6] ring-1 ring-[#E5E8EB]">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80"
                alt="baeterry 프로필 사진"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Title Stack */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-[#E8F3FF] px-2.5 py-0.5 text-[12px] font-semibold text-[#3182F6]">
                  프론트엔드 개발자
                </span>
              </div>
              <h1 className="mt-1 text-[22px] font-bold leading-snug tracking-tight text-[#191F28]">
                baeterry
              </h1>
            </div>
          </div>

          {/* Intro Description (해요체) */}
          <div className="mt-5 rounded-2xl bg-[#F9FAFB] p-4 text-[15px] leading-relaxed text-[#4E5968]">
            사용자 경험과 직관적인 인터페이스를 고민해요.<br />
            문제를 코드로 해결하고 새로운 기술을 배우는 과정을 즐겨요.
          </div>

          {/* Tech Stack Chips */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {techChips.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[#E5E8EB] bg-white px-3 py-1 text-[13px] font-medium text-[#4E5968]"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Links & Projects Section (TDS List-Rows in White Container) */}
        <section className="overflow-hidden rounded-3xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="px-5 pt-5 pb-2">
            <h2 className="text-[17px] font-bold text-[#191F28]">
              링크와 프로젝트
            </h2>
          </div>

          <div className="divide-y divide-[#F2F4F6]">
            {links.map((link) => {
              const IconComp = link.icon;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-5 py-4 transition hover:bg-[#F9FAFB] active:bg-[#F2F4F6]"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3.5">
                    {/* 44px Icon Avatar */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F2F4F6] text-[#333D4B]">
                      <IconComp className="h-5 w-5" />
                    </div>
                    
                    {/* Text Stack */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[16px] font-semibold text-[#191F28]">
                          {link.title}
                        </span>
                        {link.badge && (
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${link.badgeColor}`}>
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-[13px] text-[#8B95A1]">
                        {link.subtitle}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="ml-2 h-5 w-5 shrink-0 text-[#B0B8C1]" />
                </a>
              );
            })}
          </div>
        </section>

        {/* Quick Contact Card */}
        <section className="rounded-3xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E8F3FF] text-[#3182F6]">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="block text-[15px] font-semibold text-[#191F28]">
                  이메일 문의
                </span>
                <span className="block truncate text-[13px] text-[#8B95A1]">
                  contact@example.com
                </span>
              </div>
            </div>

            {/* TDS Secondary Button (grey-100 fill, grey-900 text) */}
            <button
              onClick={handleCopyEmail}
              type="button"
              className="shrink-0 rounded-xl bg-[#F2F4F6] px-3.5 py-2 text-[13px] font-semibold text-[#191F28] transition hover:bg-[#E5E8EB] active:bg-[#D1D6DB]"
            >
              복사
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-4 text-center text-[13px] text-[#8B95A1]">
          <p>© 2026 baeterry. All rights reserved.</p>
        </footer>

      </div>

      {/* TDS Bottom CTA (56pt Fixed Bottom Button with Gradient Protection) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 mx-auto max-w-md bg-gradient-to-t from-[#F2F4F6] via-[#F2F4F6]/95 to-transparent px-4 pb-6 pt-4">
        <a
          href="mailto:contact@example.com"
          className="tds-btn-press flex h-14 w-full items-center justify-center rounded-2xl bg-[#3182F6] text-[17px] font-bold text-white shadow-[0_4px_16px_rgba(49,130,246,0.3)] transition hover:bg-[#1B64DA]"
        >
          이메일로 대화하기
        </a>
      </div>

      {/* TDS Toast (grey-900 with Green Check Icon) */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-[#191F28] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.2)] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-[#04C056]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </main>
  );
}
