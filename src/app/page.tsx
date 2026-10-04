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
  Sparkles,
  Star,
  Compass,
  Rocket,
  ChevronRight,
} from "lucide-react";

// Clean inline Github SVG icon for cosmic theme
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

  const cosmicLinks = [
    {
      id: "mission-1",
      title: "GitHub Mission Base",
      description: "오픈소스 코드베이스 및 코스믹 프로젝트 저장소",
      url: "https://github.com/baeterry",
      icon: GithubIcon,
      stars: "+150 Stars",
      status: "Active Orbit",
      statusType: "completed",
    },
    {
      id: "mission-2",
      title: "Nebula Tech Journal",
      description: "새로운 기술 탐험과 배움의 기록 로그",
      url: "https://github.com/baeterry",
      icon: Globe,
      stars: "+90 Stars",
      status: "Weekly Log",
      statusType: "info",
    },
    {
      id: "mission-3",
      title: "Constellation Projects",
      description: "직접 설계하고 완성한 웹 서비스 쇼케이스",
      url: "https://github.com/baeterry",
      icon: Briefcase,
      stars: "+300 Stars",
      status: "Featured",
      statusType: "warning",
    },
    {
      id: "mission-4",
      title: "Subspace Transmission",
      description: "새로운 협업 제안 및 커피챗 전송 채널",
      url: "mailto:contact@example.com",
      icon: Mail,
      stars: "+50 Stars",
      status: "Open Beacon",
      statusType: "completed",
    },
  ];

  const cosmicTechBadges = [
    { name: "Next.js 16", tag: "Engine" },
    { name: "React 19", tag: "Core" },
    { name: "TypeScript", tag: "Shield" },
    { name: "Tailwind CSS", tag: "Aesthetics" },
    { name: "Node.js", tag: "Thruster" },
    { name: "Git", tag: "Nav" },
  ];

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#1E1B4B] px-4 py-10 sm:px-6 sm:py-16">
      
      {/* Background Cosmic Starfield & Nebula Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Deep Nebula Ambient Glows */}
        <div className="absolute -left-32 -top-32 h-[450px] w-[450px] rounded-full bg-[#A78BFA]/15 blur-[120px]" />
        <div className="absolute -right-32 top-1/3 h-[500px] w-[500px] rounded-full bg-[#3D3890]/40 blur-[140px]" />
        <div className="absolute bottom-10 left-1/4 h-[350px] w-[350px] rounded-full bg-[#FDE047]/10 blur-[100px]" />

        {/* Twinkling Space Stars */}
        <div className="animate-twinkle absolute left-[15%] top-[18%] h-2 w-2 rounded-full bg-[#FDE047]" />
        <div className="animate-twinkle-delayed absolute right-[20%] top-[25%] h-1.5 w-1.5 rounded-full bg-white" />
        <div className="animate-twinkle absolute left-[80%] bottom-[30%] h-2 w-2 rounded-full bg-[#A78BFA]" />
        <div className="animate-twinkle-delayed absolute left-[25%] bottom-[15%] h-1.5 w-1.5 rounded-full bg-[#FDE047]" />
        <div className="animate-twinkle absolute right-[10%] top-[60%] h-2.5 w-2.5 rounded-full bg-white/80" />
      </div>

      {/* Main StarChart Card (Raised Surface with Nebula Border) */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-[#A78BFA]/30 bg-[#2E2A6E] p-6 shadow-2xl backdrop-blur-md sm:p-8">
        
        {/* Top Header Mission Status Pill */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full bg-[#141136] px-3.5 py-1.5 border border-[#A78BFA]/20">
            <Rocket className="h-4 w-4 text-[#FDE047]" />
            <span className="font-mono-custom text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
              Mission Log 01
            </span>
          </div>

          {/* Achievement Star Badge (Elevated Pill with Star Glow) */}
          <div className="flex items-center gap-1.5 rounded-full border border-[#FDE047]/60 bg-[#141136] px-3.5 py-1.5 glow-star-sm">
            <Star className="h-4 w-4 fill-[#FDE047] text-[#FDE047]" />
            <span className="font-headline text-xs font-bold text-[#FDE047]">
              1,280 Stars
            </span>
          </div>
        </div>

        {/* Profile Avatar & Space Rank Header */}
        <div className="flex flex-col items-center text-center">
          
          {/* Avatar with Cosmic Orbit Ring & Glow */}
          <div className="relative mb-5 group">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-[#A78BFA] bg-[#141136] p-1 glow-nebula-md transition-transform duration-300 group-hover:scale-105 sm:h-32 sm:w-32">
              <div className="relative h-full w-full overflow-hidden rounded-full">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80"
                  alt="baeterry Cosmic Explorer Profile"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Orbiting Planet / Tech Badge */}
            <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#FDE047] bg-[#1E1B4B] text-[#FDE047] glow-star-sm">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>

          {/* Space Explorer Name (Fredoka 36px bold) */}
          <div className="flex items-center gap-2">
            <h1 className="font-headline text-3xl font-bold tracking-tight text-white sm:text-4xl">
              baeterry
            </h1>
            <span className="rounded-full bg-[#4ADE80]/20 px-2.5 py-0.5 font-headline text-xs font-semibold text-[#4ADE80]">
              Lv.12 Explorer
            </span>
          </div>

          {/* Subtitle / Role (Fredoka 18px semibold) */}
          <p className="mt-1.5 flex items-center gap-1.5 font-headline text-base font-semibold text-[#A78BFA]">
            <Compass className="h-4 w-4 text-[#FDE047]" />
            Frontend &amp; Web Developer
          </p>

          {/* Cosmic Bio Card (Sunken Surface #141136) */}
          <div className="mt-5 w-full rounded-xl border border-[#A78BFA]/20 bg-[#141136] p-4 text-center">
            <p className="font-sans text-sm leading-relaxed text-[#E2E8F0] sm:text-base">
              &ldquo;우주를 탐험하듯 새로운 기술을 배우고 기록합니다.<br className="hidden sm:inline" />
              직관적인 사용자 인터페이스와 멋진 웹 모험을 만듭니다.&rdquo;
            </p>
          </div>

          {/* Tech Stack Chips (Pill-shaped with Nebula Accent) */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {cosmicTechBadges.map((tech) => (
              <span
                key={tech.name}
                className="flex items-center gap-1.5 rounded-full border border-[#A78BFA]/30 bg-[#1E1B4B]/80 px-3 py-1 font-sans text-xs font-medium text-[#E2E8F0] transition hover:border-[#A78BFA] hover:bg-[#A78BFA]/15 hover:text-white"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#FDE047]" />
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        {/* Section Divider with Cosmic Star Icon */}
        <div className="relative my-7 flex items-center justify-center">
          <div className="w-full border-t border-[#A78BFA]/20" />
          <div className="absolute flex items-center gap-1.5 rounded-full border border-[#A78BFA]/30 bg-[#2E2A6E] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
            <Terminal className="h-3.5 w-3.5 text-[#FDE047]" />
            <span>Active Expeditions</span>
          </div>
        </div>

        {/* Cosmic Links List (StarChart Interactive Cards) */}
        <div className="flex flex-col gap-3.5">
          {cosmicLinks.map((link) => {
            const IconComponent = link.icon;
            
            // Status Chip Colors per StarChart spec
            let statusBadgeClass = "bg-[#4ADE80]/20 text-[#4ADE80]";
            if (link.statusType === "warning") statusBadgeClass = "bg-[#FBBF24]/20 text-[#FBBF24]";
            if (link.statusType === "info") statusBadgeClass = "bg-[#60A5FA]/20 text-[#60A5FA]";

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex min-h-[56px] items-center justify-between gap-3 rounded-xl border border-[#A78BFA]/20 bg-[#1E1B4B]/90 p-4 transition-all duration-200 hover:border-[#A78BFA] hover:bg-[#A78BFA]/10 hover:glow-nebula-sm active:scale-[0.99]"
              >
                {/* Left Icon + Text Info */}
                <div className="flex min-w-0 flex-1 items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#A78BFA]/40 bg-[#2E2A6E] text-[#A78BFA] transition-colors group-hover:border-[#FDE047] group-hover:text-[#FDE047]">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate font-headline text-base font-semibold text-white group-hover:text-[#FDE047]">
                        {link.title}
                      </h2>
                      <span className={`rounded-full px-2 py-0.5 font-sans text-[11px] font-semibold ${statusBadgeClass}`}>
                        {link.status}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate font-sans text-xs text-[#94A3B8]">
                      {link.description}
                    </p>
                  </div>
                </div>

                {/* Right Star Rewards & Chevron */}
                <div className="flex shrink-0 items-center gap-2">
                  <span className="hidden sm:inline-flex items-center gap-1 font-headline text-xs font-semibold text-[#FDE047]">
                    <Star className="h-3 w-3 fill-[#FDE047]" />
                    {link.stars}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2E2A6E] text-[#A78BFA] transition-transform group-hover:translate-x-1 group-hover:text-white">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Subspace Signal / Copy Email Widget (Sunken Surface with Primary CTA) */}
        <div className="mt-6 rounded-xl border border-[#A78BFA]/30 bg-[#141136] p-3.5 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2E2A6E] text-[#60A5FA]">
                <Mail className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="block font-headline text-xs font-semibold text-[#94A3B8]">
                  Subspace Email
                </span>
                <span className="block truncate font-mono-custom text-xs font-bold text-[#F3F4F6] sm:text-sm">
                  contact@example.com
                </span>
              </div>
            </div>

            {/* StarChart Primary Button (Star Yellow Fill, Deep Space Text, glow-star-sm) */}
            <button
              onClick={handleCopyEmail}
              type="button"
              className="flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#FDE047] px-5 py-2.5 font-headline text-sm font-bold text-[#1E1B4B] transition-all hover:bg-[#FEF08A] hover:glow-star-sm active:opacity-90"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 stroke-[2.5]" />
                  <span>Transmitted!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 stroke-[2.5]" />
                  <span>Copy Signal</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer info with Constellation Tag */}
        <div className="mt-7 flex flex-col items-center justify-between gap-2 border-t border-[#A78BFA]/20 pt-4 text-center font-sans text-xs text-[#94A3B8] sm:flex-row">
          <span>© 2026 baeterry. All rights reserved.</span>
          <div className="flex items-center gap-1.5 font-headline font-semibold text-[#A78BFA]">
            <Sparkles className="h-3.5 w-3.5 text-[#FDE047]" />
            <span>Powered by StarChart Design</span>
          </div>
        </div>

      </div>
    </main>
  );
}
