# Design System (shadcn/ui 기반)

## 1. 소개
이 디자인 시스템은 **shadcn/ui** 와 **Tailwind CSS v4** 를 기반으로 하며, **토스 디자인 시스템**을 모범 모델로 삼아 일관된 UI/UX 를 제공하도록 설계되었습니다.

## 2. 색상 팔레트
| 토큰 | 의미 | HEX | Tailwind 색상 변수 |
|------|------|-----|--------------------|
| `primary` | 주요 액션 색상 | `#0D6EFD` | `var(--primary)` |
| `secondary` | 보조 액션 색상 | `#6C757D` | `var(--secondary)` |
| `success` | 성공 상태 | `#28A745` | `var(--success)` |
| `warning` | 경고 상태 | `#FFC107` | `var(--warning)` |
| `danger` | 오류 상태 | `#DC3545` | `var(--danger)` |
| `background` | 기본 배경 | `#F8FAFC` | `var(--bg)` |
| `surface` | 카드·모달 배경 | `#FFFFFF` | `var(--surface)` |
| `text-primary` | 기본 텍스트 | `#212529` | `var(--text-primary)` |
| `text-secondary` | 보조 텍스트 | `#6C757D` | `var(--text-secondary)` |

> **Tailwind 적용 예시**
> ```html
> <div class="bg-primary text-white p-4 rounded-lg">Primary Button</div>
> ```

## 3. 타이포그래피
| 토큰 | 용도 | 폰트 | 크기 | 무게 |
|------|------|------|------|------|
| `heading-1` | 페이지 타이틀 | `Inter, sans-serif` | `32px` | `700` |
| `heading-2` | 섹션 타이틀 | `Inter` | `24px` | `600` |
| `body-lg` | 일반 본문 (큰) | `Inter` | `18px` | `400` |
| `body` | 일반 본문 | `Inter` | `16px` | `400` |
| `caption` | 보조 텍스트 | `Inter` | `14px` | `400` |

Tailwind utilities (e.g., `text-2xl font-bold`) can be mapped to these tokens via `@layer utilities` in `tailwind.config.js`.

## 4. 스페이싱 & 레이아웃
- **기본 스페이싱 스케일**: `4, 8, 12, 16, 24, 32, 40, 48, 64` (픽셀)
- **그리드**: 12‑column 그리드, gutter `24px`
- **컨테이너**: `max-w-7xl` (≈ 1320px) + `mx-auto`

## 5. 컴포넌트 가이드 (shadcn/ui 기반)
| 컴포넌트 | 설명 | shadcn/ui 사용 예시 |
|----------|------|-------------------|
| `Button` | 기본 액션 버튼 | `import { Button } from "@/components/ui/button"` |
| `Card` | 콘텐츠 컨테이너 | `import { Card, CardHeader, CardContent } from "@/components/ui/card"` |
| `Modal` | 오버레이 다이얼로그 | `import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"` |
| `Input` | 텍스트 입력 | `import { Input } from "@/components/ui/input"` |
| `Toast` | 알림 | `import { Toast, ToastProvider } from "@/components/ui/toast"` |
| `Select` | 드롭다운 선택 | `import { Select, SelectTrigger, SelectContent } from "@/components/ui/select"` |

### 컴포넌트 스타일 원칙
1. **일관된 라운드**: `border-radius: 8px` (Tailwind `rounded-md`).
2. **그림자**: `shadow-sm` 은 기본, `shadow-md` 은 강조된 경우.
3. **상태 변형**: `hover`, `focus`, `disabled` 에 대한 Tailwind 변형을 명시.
4. **접근성**: `aria-*` 속성, 포커스 가시성(`focus-visible:ring-2`) 적용.

## 6. 아이콘
- **lucide-react** 를 사용합니다. 예시: `import { X, Check } from "lucide-react"`.
- 아이콘 크기는 `w-5 h-5` 를 기본으로 하고, 필요 시 `w-4 h-4`, `w-6 h-6` 으로 조정합니다.

## 7. 다크 모드
- `darkMode: ["class"]` 로 설정되어 있어, `class="dark"` 를 루트에 추가하면 자동 적용됩니다.
- 색상 토큰은 `dark:` 접두사를 사용해 오버라이드합니다. 예시:
> ```css
> .dark { --bg: #111827; --text-primary: #F9FAFB; }
> ```

## 8. 문서화 & 파일 구조
```
my_link_hy/
 ├─ src/
 │   ├─ components/
 │   │   └─ ui/           # shadcn/ui 로 생성된 컴포넌트
 │   └─ app/
 ├─ public/
 ├─ tailwind.config.js
 ├─ postcss.config.js
 ├─ design.md           # ← 현재 문서
 └─ PRD.md
```

## 9. 버전 관리
- **Tailwind**: `^4.0.0` (최신)
- **shadcn/ui**: `^0.4.0` (Base UI + Nova 프리셋)
- **lucide-react**: 최신 버전 (React 19 호환)

---
*이 문서는 shadcn/ui 기반 디자인 시스템을 토스 디자인 시스템 스타일로 정의하고, 향후 구현 시 참고하도록 작성되었습니다.*
