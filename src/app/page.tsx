export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 px-4 py-12 text-zinc-800 dark:from-zinc-950 dark:to-zinc-900 dark:text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white/80 p-8 shadow-xl shadow-zinc-200/50 backdrop-blur-sm transition-all hover:shadow-2xl dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:shadow-none">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 text-3xl font-bold text-white shadow-md ring-4 ring-white dark:ring-zinc-800">
            홍
          </div>

          {/* Name & Badge */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              홍길동
            </h1>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              Developer
            </span>
          </div>

          {/* Subtitle / Role */}
          <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Frontend &amp; Web Developer
          </p>

          {/* Bio */}
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            사용자 경험과 직관적인 인터페이스를 고민하는 개발자입니다.<br />
            문제를 코드로 해결하고 새로운 기술을 배우며 성장하는 과정을 즐깁니다.
          </p>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-zinc-100 dark:border-zinc-800" />

        {/* Quick Links / Actions */}
        <div className="flex flex-col gap-3">
          <a
            href="https://github.com/baeterry"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            GitHub (@baeterry) 바로가기
          </a>
          <a
            href="mailto:contact@example.com"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750"
          >
            이메일 보내기
          </a>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
          © 2026 홍길동. All rights reserved.
        </p>
      </div>
    </main>
  );
}
