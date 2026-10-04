"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Terminal,
  Globe,
  Briefcase,
  Copy,
  Check,
  Code,
  ArrowUpRight,
} from "lucide-react";

// Clean inline Github SVG icon
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
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@example.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const links = [
    {
      id: "01",
      title: "GitHub Repository",
      description: "오픈소스 및 사이드 프로젝트 저장소",
      url: "https://github.com/baeterry",
      icon: GithubIcon,
      bg: "bg-[#ffdf00]",
      hoverBg: "hover:bg-[#ffe838]",
      badge: "POPULAR",
      badgeColor: "bg-black text-white",
    },
    {
      id: "02",
      title: "Tech Blog & Notes",
      description: "배운 것을 기록하고 공유하는 기술 블로그",
      url: "https://github.com/baeterry",
      icon: Globe,
      bg: "bg-[#a3e635]",
      hoverBg: "hover:bg-[#bef264]",
      badge: "WRITING",
      badgeColor: "bg-white text-black",
    },
    {
      id: "03",
      title: "Portfolio Projects",
      description: "직접 기획하고 만든 웹 서비스 쇼케이스",
      url: "https://github.com/baeterry",
      icon: Briefcase,
      bg: "bg-[#38bdf8]",
      hoverBg: "hover:bg-[#7dd3fc]",
      badge: "FEATURED",
      badgeColor: "bg-[#fb7185] text-white",
    },
    {
      id: "04",
      title: "Send Direct Email",
      description: "새로운 협업 제안 및 질문 환영",
      url: "mailto:contact@example.com",
      icon: Mail,
      bg: "bg-[#f472b6]",
      hoverBg: "hover:bg-[#f490c4]",
      badge: "CONTACT",
      badgeColor: "bg-black text-white",
    },
  ];

  const techStacks = [
    { name: "Next.js 16", bg: "bg-white text-black" },
    { name: "React 19", bg: "bg-[#67e8f9] text-black" },
    { name: "TypeScript", bg: "bg-[#60a5fa] text-white" },
    { name: "Tailwind CSS", bg: "bg-[#5eead4] text-black" },
    { name: "Node.js", bg: "bg-[#86efac] text-black" },
    { name: "Git & GitHub", bg: "bg-[#fca5a5] text-black" },
  ];

  return (
    <main className="flex min-h-screen w-full items-center justify-center p-3 sm:p-6 md:p-8">
      {/* Outer Retro Neobrutalism Window */}
      <div className="relative w-full max-w-xl rounded-2xl border-3 sm:border-4 border-black bg-[#fafaf9] shadow-[5px_5px_0px_0px_#000000] sm:shadow-[8px_8px_0px_0px_#000000] md:shadow-[10px_10px_0px_0px_#000000]">
        
        {/* Retro Window Title Bar */}
        <div className="flex items-center justify-between border-b-3 sm:border-b-4 border-black bg-[#ff6b6b] px-3 py-2 sm:px-4 sm:py-3">
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <span className="h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border-2 border-black bg-[#ff5f56]" />
            <span className="h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border-2 border-black bg-[#ffbd2e]" />
            <span className="h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border-2 border-black bg-[#27c93f]" />
          </div>
          <span className="truncate px-2 font-mono text-[11px] font-black uppercase tracking-wide text-black sm:text-xs md:text-sm">
            baeterry.dev - Profile Card v2.0
          </span>
          <div className="flex shrink-0 items-center gap-1 font-mono text-[10px] sm:text-xs font-bold">
            <span className="rounded border border-black bg-white px-1 sm:px-1.5 py-0.5">_</span>
            <span className="rounded border border-black bg-white px-1 sm:px-1.5 py-0.5">✕</span>
          </div>
        </div>

        {/* Inner Content Area */}
        <div className="relative p-4 sm:p-6 md:p-8">
          {/* Top Floating Badges */}
          <div className="absolute -top-4 right-3 sm:-top-5 sm:right-4 z-10 rotate-2 sm:rotate-3 rounded-lg border-2 sm:border-3 border-black bg-[#4ade80] px-2.5 py-0.5 sm:px-3.5 sm:py-1 text-[10px] sm:text-xs font-black uppercase tracking-wide text-black shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000]">
            ⚡ OPEN FOR WORK
          </div>

          <div className="absolute -top-3 left-3 sm:-top-3 sm:left-4 z-10 -rotate-2 sm:-rotate-3 rounded-lg border-2 sm:border-3 border-black bg-[#f43f5e] px-2.5 py-0.5 sm:px-3 sm:py-1 font-mono text-[10px] sm:text-xs font-black text-white shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000]">
            🔥 VIBE CODER
          </div>

          {/* Profile Header & Visual Section */}
          <div className="mt-3 sm:mt-2 flex flex-col items-center text-center">
            
            {/* Avatar & Badges */}
            <div className="relative mb-4 sm:mb-5">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 overflow-hidden rounded-2xl border-3 sm:border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000] sm:shadow-[5px_5px_0px_0px_#000]">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80"
                  alt="baeterry 프로필 사진"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Mini Icon Sticker */}
              <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl border-2 sm:border-3 border-black bg-[#ffdf00] text-black shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000]">
                <Code className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
              </div>
            </div>

            {/* Name and Tag */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <h1 className="font-mono text-2xl font-black tracking-tight text-black sm:text-3xl md:text-4xl">
                baeterry
              </h1>
              <span className="rotate-1 rounded-md border-2 border-black bg-[#c084fc] px-1.5 py-0.5 text-[10px] sm:text-xs font-extrabold text-black shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000]">
                DEV 💻
              </span>
            </div>

            {/* Subtitle / Role */}
            <div className="mt-1.5 sm:mt-2 inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-3 py-1 sm:px-4 sm:py-1 text-xs sm:text-sm font-bold text-black shadow-[2px_2px_0px_0px_#000]">
              <Terminal className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5]" />
              <span>Frontend &amp; Web Developer</span>
            </div>

            {/* Bio Callout Box */}
            <div className="mt-4 sm:mt-5 w-full rounded-xl border-2 sm:border-3 border-black bg-[#fef08a] p-3 sm:p-4 text-center font-medium text-black shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000]">
              <p className="text-xs sm:text-sm md:text-base font-bold leading-relaxed break-keep">
                &ldquo;사용자 경험과 직관적인 인터페이스를 고민합니다.<br className="hidden sm:inline" />
                문제를 코드로 해결하고 새로운 기술을 배우는 과정을 즐깁니다!&rdquo;
              </p>
            </div>

            {/* Tech Stack Sticker Wall */}
            <div className="mt-4 sm:mt-5 flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {techStacks.map((tech) => (
                <span
                  key={tech.name}
                  className={`rounded-lg border-2 border-black px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#000] ${tech.bg}`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* Section Divider with Badge */}
          <div className="relative my-5 sm:my-7 flex items-center justify-center">
            <div className="w-full border-b-2 sm:border-b-4 border-black" />
            <div className="absolute rounded-md border-2 border-black bg-white px-2.5 py-0.5 sm:px-3 sm:py-1 font-mono text-[10px] sm:text-xs font-black uppercase text-black shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000]">
              ★ SELECT LINK ★
            </div>
          </div>

          {/* Link Buttons (Responsive Neobrutalism Action Cards) */}
          <div className="flex flex-col gap-3 sm:gap-3.5">
            {links.map((link) => {
              const IconComp = link.icon;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative flex items-center justify-between gap-2.5 rounded-xl border-2 sm:border-3 border-black p-3 sm:p-4 font-bold text-black shadow-[3.5px_3.5px_0px_0px_#000] sm:shadow-[5px_5px_0px_0px_#000] transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5 sm:hover:translate-x-1 sm:hover:translate-y-1 hover:shadow-[1.5px_1.5px_0px_0px_#000] sm:hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-1 active:translate-y-1 sm:active:translate-x-1.5 sm:active:translate-y-1.5 active:shadow-none ${link.bg} ${link.hoverBg}`}
                >
                  {/* Left content (Icon + Text) */}
                  <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3.5">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-white text-black shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] group-hover:scale-105 transition-transform">
                      <IconComp className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.5]" />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="font-mono text-[10px] sm:text-xs font-black text-black/60 shrink-0">
                          [{link.id}]
                        </span>
                        <h2 className="truncate text-sm font-black text-black sm:text-base md:text-lg">
                          {link.title}
                        </h2>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] sm:text-xs font-semibold text-black/80">
                        {link.description}
                      </p>
                    </div>
                  </div>

                  {/* Right side (Badge + Arrow Button) */}
                  <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                    {link.badge && (
                      <span className={`hidden md:inline-block rounded border border-black px-1.5 py-0.5 text-[10px] font-black ${link.badgeColor}`}>
                        {link.badge}
                      </span>
                    )}
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-white text-black transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000]">
                      <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[3]" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Quick Copy Email Widget */}
          <div className="mt-4 sm:mt-5 flex items-center justify-between gap-2 rounded-xl border-2 sm:border-3 border-black bg-white p-2.5 sm:p-3 shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000]">
            <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2 overflow-hidden text-xs font-mono font-bold text-black sm:text-sm">
              <span className="shrink-0 rounded bg-black px-1.5 py-0.5 text-[10px] sm:text-xs text-white">EMAIL</span>
              <span className="truncate text-xs sm:text-sm">contact@example.com</span>
            </div>
            <button
              onClick={handleCopyEmail}
              type="button"
              className="flex shrink-0 items-center gap-1 sm:gap-1.5 rounded-lg border-2 border-black bg-[#ffdf00] px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-black text-black shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:bg-[#ffe838]"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[3] text-green-700" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[2.5]" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom Footer Info */}
          <div className="mt-5 sm:mt-6 flex flex-col items-center justify-between gap-2 border-t-2 sm:border-t-3 border-black pt-3 sm:pt-4 font-mono text-[11px] sm:text-xs font-bold text-black sm:flex-row">
            <span>© 2026 baeterry. All rights reserved.</span>
            <span className="flex items-center gap-1 rounded border border-black bg-[#fed7aa] px-2 py-0.5">
              <span>DESIGN: NEOBRUTALISM</span>
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
