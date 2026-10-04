import Image from "next/image";
import {
  Mail,
  ExternalLink,
  Code2,
  Sparkles,
  Terminal,
  Globe,
  Briefcase,
} from "lucide-react";

// Lucide v0.4+ doesn't export brand icons directly, so we define a clean Github icon component
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
  const links = [
    {
      title: "GitHub 저장소",
      description: "@baeterry의 소스코드 및 프로젝트 둘러보기",
      url: "https://github.com/baeterry",
      icon: GithubIcon,
      featured: true,
      tag: "Code Repository",
    },
    {
      title: "개발 블로그 & 아티클",
      description: "기술적 고민과 배움을 기록하는 공간",
      url: "https://github.com/baeterry",
      icon: Globe,
      tag: "Tech Blog",
    },
    {
      title: "포트폴리오 & 프로젝트 쇼케이스",
      description: "직접 설계하고 제작한 웹 서비스 모음",
      url: "https://github.com/baeterry",
      icon: Briefcase,
      tag: "Projects",
    },
    {
      title: "이메일로 커피챗 / 문의하기",
      description: "새로운 협업 기회 및 질문은 언제든 환영합니다",
      url: "mailto:contact@example.com",
      icon: Mail,
      tag: "Contact",
    },
  ];

  const techStacks = [
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Git",
  ];

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-slate-100 sm:py-16">
      {/* Dynamic Background Glows */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-emerald-600/15 blur-3xl" />

      {/* Main Profile Card Container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        {/* Top Cover Banner */}
        <div className="relative -mx-6 -mt-6 mb-6 h-36 overflow-hidden rounded-t-3xl sm:-mx-8 sm:-mt-8 sm:h-40">
          <Image
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80"
            alt="Cover background"
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          {/* Top Floating Status Badge */}
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Available for Projects
          </div>
        </div>

        {/* Profile Header & Avatar */}
        <div className="flex flex-col items-center text-center">
          {/* Avatar with Ring & Status Indicator */}
          <div className="relative -mt-20 mb-4 group">
            <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-slate-900 shadow-xl transition duration-300 group-hover:scale-105 group-hover:ring-blue-500">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80"
                alt="baeterry 프로필 사진"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md ring-2 ring-slate-900">
              <Code2 className="h-4 w-4" />
            </div>
          </div>

          {/* Name and Badges */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              baeterry
            </h1>
            <span className="flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
              <Sparkles className="h-3 w-3" />
              Developer
            </span>
          </div>

          {/* Subtitle / Role */}
          <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-400">
            <Terminal className="h-3.5 w-3.5 text-blue-400" />
            Frontend &amp; Web Developer
          </p>

          {/* Bio Description */}
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
            사용자 경험과 직관적인 인터페이스를 설계하는 개발자입니다.<br />
            문제를 기술로 해결하며 끊임없이 학습하고 기록합니다.
          </p>

          {/* Tech Stack Chips */}
          <div className="mt-5 flex flex-wrap justify-center gap-1.5">
            {techStacks.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-slate-700/60 bg-slate-800/60 px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Divider with Center Icon */}
        <div className="relative my-7 flex items-center justify-center">
          <div className="w-full border-t border-slate-800" />
          <div className="absolute bg-slate-900 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Links &amp; Connect
          </div>
        </div>

        {/* Links List */}
        <div className="flex flex-col gap-3.5">
          {links.map((link) => {
            const IconComponent = link.icon;
            return (
              <a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex items-center justify-between rounded-2xl border p-4 transition-all duration-300 active:scale-[0.98] ${
                  link.featured
                    ? "border-blue-500/40 bg-gradient-to-r from-blue-950/40 to-slate-800/80 shadow-lg shadow-blue-500/10 hover:border-blue-400 hover:from-blue-950/60 hover:to-slate-800"
                    : "border-slate-800 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800/80"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition duration-300 ${
                      link.featured
                        ? "bg-blue-600 text-white group-hover:bg-blue-500"
                        : "bg-slate-700/60 text-slate-300 group-hover:bg-slate-700 group-hover:text-white"
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-white group-hover:text-blue-300 sm:text-base">
                        {link.title}
                      </h2>
                      {link.tag && (
                        <span className="rounded bg-slate-700/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-300">
                          {link.tag}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">
                      {link.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-2 text-slate-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">
                  <ExternalLink className="h-4 w-4" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-800/80 pt-5 text-center text-xs text-slate-500 sm:flex-row">
          <span>© 2026 baeterry. All rights reserved.</span>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with Next.js &amp; Tailwind</span>
          </div>
        </div>
      </div>
    </main>
  );
}
