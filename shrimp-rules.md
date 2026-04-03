# Invoice-Web 개발 규칙 (AI Agent 전용)

> Notion DB 기반 견적서 웹뷰어 — Next.js 15.5.3 + React 19 + TypeScript 5 + TailwindCSS v4 + shadcn/ui

---

## 1. 프로젝트 아키텍처

### 디렉토리 구조

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 루트 레이아웃 (ThemeProvider, Toaster 포함)
│   ├── page.tsx                  # 견적서 목록 페이지 (/)
│   ├── globals.css               # Tailwind v4 + CSS 변수 (oklch)
│   ├── quotes/                   # 공급자 견적서 관련 라우트 (예정)
│   │   └── [id]/page.tsx         # 견적서 상세 페이지
│   └── view/                     # 클라이언트 공개 뷰어 라우트 (예정)
│       └── [id]/page.tsx         # 견적서 뷰어 페이지
├── components/
│   ├── layout/                   # 공통 레이아웃 컴포넌트
│   ├── navigation/               # 네비게이션 컴포넌트
│   ├── providers/                # Context Provider 컴포넌트
│   └── ui/                       # shadcn/ui 컴포넌트 (수정 금지)
├── lib/
│   ├── utils.ts                  # cn() 함수 (clsx + tailwind-merge)
│   ├── env.ts                    # 환경 변수 Zod 검증
│   ├── notion.ts                 # Notion API 클라이언트 (생성 예정)
│   └── types.ts                  # 전역 TypeScript 타입 (생성 예정)
└── actions/                      # Server Actions (생성 예정)
```

### 라우트 구조 (4개 페이지)

| 경로                | 파일                       | 목적                   | 접근 주체  |
| ------------------- | -------------------------- | ---------------------- | ---------- |
| `/`                 | `app/page.tsx`             | 견적서 목록 (대시보드) | 공급자     |
| `/quotes/[id]`      | `app/quotes/[id]/page.tsx` | 견적서 상세 + URL 복사 | 공급자     |
| `/view/[id]`        | `app/view/[id]/page.tsx`   | 견적서 공개 뷰어       | 클라이언트 |
| `/view/[id]` (제한) | 동일 파일 내 조건 처리     | 접근 제한 안내         | 클라이언트 |

---

## 2. TypeScript 타입 규칙

### 핵심 타입 정의 위치

- **모든 전역 타입**: `src/lib/types.ts`에 정의
- **컴포넌트 props**: 해당 컴포넌트 파일 내 인라인 정의
- **API 응답 타입**: `src/lib/types.ts`에서 Notion DB 필드 기반으로 정의

### 필수 타입 구조 (Notion DB 기준)

```typescript
// src/lib/types.ts 에 정의할 타입들
interface QuoteItem {
  name: string
  quantity: number
  unitPrice: number
  amount: number
}

interface SupplierInfo {
  name: string
  email?: string
  phone?: string
  address?: string
}

type QuoteStatus = 'draft' | 'sent' | 'confirmed' | 'expired'

interface Quote {
  id: string // Notion 페이지 ID
  quoteNumber: string
  clientName: string
  issueDate: string // ISO 날짜 문자열
  expiryDate: string
  items: QuoteItem[]
  supplierInfo: SupplierInfo
  memo?: string
  status: QuoteStatus
  isPublic: boolean
  totalAmount: number
}
```

### 타입 규칙

- `any` 타입 사용 **금지** — `unknown` 또는 명시적 타입 사용
- `as` 타입 단언은 Notion API 응답 파싱 시에만 허용
- 모든 함수 파라미터/반환값에 명시적 타입 지정
- Zod 스키마에서 타입 추론: `z.infer<typeof schema>` 활용

---

## 3. 컴포넌트 작성 규칙

### RSC vs 클라이언트 컴포넌트 판단

- **기본**: RSC(React Server Component) 우선
- **`'use client'` 추가 조건**: useState, useEffect, 이벤트 핸들러, 브라우저 API 사용 시에만
- **클라이언트 컴포넌트는 트리 말단(leaf)에 배치** — 부모를 클라이언트로 만들지 않음

### 컴포넌트 파일 위치

| 유형                     | 위치                                     |
| ------------------------ | ---------------------------------------- |
| shadcn/ui 컴포넌트       | `components/ui/` — 직접 수정 금지        |
| 공통 레이아웃            | `components/layout/`                     |
| 페이지별 전용 컴포넌트   | `app/[route]/_components/`               |
| 재사용 비즈니스 컴포넌트 | `components/` 루트 또는 적절한 하위 폴더 |

### shadcn/ui 사용 규칙

- 새 컴포넌트 추가: `npx shadcn@latest add <component-name>`
- `components/ui/` 파일 직접 수정 **금지**
- 커스터마이징은 래퍼 컴포넌트 생성으로 처리
- 사용 가능한 기존 컴포넌트: alert, avatar, badge, button, card, checkbox, dialog, dropdown-menu, form, input, label, navigation-menu, progress, select, separator, sheet, skeleton, sonner

### CVA(Class Variance Authority) 패턴

- 변형이 2개 이상인 컴포넌트는 CVA로 관리
- `cn()` 함수는 항상 `src/lib/utils.ts`에서 임포트

```typescript
// 올바른 예
import { cn } from '@/lib/utils'

// 금지
import { twMerge } from 'tailwind-merge' // 직접 사용 금지
```

---

## 4. 스타일링 규칙

### Tailwind CSS v4 사용

- **모든 색상은 CSS 변수 사용**: `bg-background`, `text-foreground`, `text-primary` 등
- **oklch 색상 직접 작성 금지** — `globals.css`의 CSS 변수를 통해서만 사용
- **인라인 스타일 (`style={}`) 금지** — Tailwind 클래스로 대체
- 새 색상/테마 변수 추가: `app/globals.css`의 `:root`와 `.dark` 블록 모두에 추가

### CSS 변수 체계 (globals.css)

```
--background / --foreground
--primary / --primary-foreground
--secondary / --secondary-foreground
--muted / --muted-foreground
--accent / --accent-foreground
--destructive / --destructive-foreground
--border / --input / --ring
--radius (sm/md/lg/xl)
```

### 다크모드

- `.dark` 클래스 기반 — `next-themes`가 자동 처리
- 직접 `dark:` Tailwind prefix 사용 가능하나, CSS 변수 우선

### 반응형

- 모바일 우선(`sm:`, `md:`, `lg:` 순)
- 모바일 레이아웃: `Sheet` 컴포넌트로 사이드 메뉴
- 데스크톱 레이아웃: `NavigationMenu` 컴포넌트

---

## 5. Notion API 구현 규칙

### 파일 위치

- Notion 클라이언트 인스턴스: `src/lib/notion.ts`
- 데이터 페칭 함수: `src/lib/notion.ts` 또는 Server Actions(`src/actions/`)

### 환경 변수

- 반드시 `src/lib/env.ts`를 통해 접근: `import { env } from '@/lib/env'`
- `.env.local`에 정의: `NOTION_API_KEY`, `NOTION_DATABASE_ID`
- 새 환경 변수 추가 시 `env.ts`의 Zod 스키마도 동시 수정

### Notion API 패턴

```typescript
// src/lib/notion.ts 에 작성
import { Client } from '@notionhq/client'
import { env } from '@/lib/env'

export const notion = new Client({ auth: env.NOTION_API_KEY })
```

- Notion 응답 데이터는 반드시 `Quote` 타입으로 변환하여 반환
- API 호출은 Server Component 또는 Server Action에서만 수행
- 클라이언트 컴포넌트에서 직접 Notion API 호출 **금지**

---

## 6. PDF 생성 규칙

- puppeteer를 사용한 Server-side PDF 생성
- PDF 생성 API Route: `app/api/pdf/[id]/route.ts`
- 인쇄 전용 CSS: `@media print` 또는 별도 PDF 레이아웃 컴포넌트
- PDF 다운로드는 `response.headers['content-type'] = 'application/pdf'`로 처리

---

## 7. 접근 제한 로직

- `isPublic === false` 또는 `status === 'expired'` → 접근 제한 UI 표시
- `/view/[id]` 라우트에서 서버 사이드에서 판단 (RSC)
- 접근 제한 시 별도 페이지 리다이렉트 없이 동일 라우트에서 조건부 렌더링

---

## 8. 다중 파일 동시 수정 규칙

| 수정 대상              | 함께 수정해야 할 파일                                |
| ---------------------- | ---------------------------------------------------- |
| 새 환경 변수 추가      | `src/lib/env.ts` + `.env.local.example`              |
| 새 라우트 페이지 생성  | 해당 `page.tsx` + 필요 시 `layout.tsx`               |
| Notion DB 필드 변경    | `src/lib/types.ts` + `src/lib/notion.ts`의 파싱 함수 |
| 새 shadcn 컴포넌트     | `npx shadcn@latest add` 실행 (수동 파일 생성 금지)   |
| 글로벌 색상 변수 추가  | `globals.css`의 `:root` + `.dark` 블록 동시 추가     |
| 상태(QuoteStatus) 변경 | `src/lib/types.ts` + 상태 배지 컴포넌트 동시 수정    |

---

## 9. 서버 액션 규칙

- 파일 위치: `src/actions/` 또는 해당 페이지 파일 내 상단에 `'use server'`
- 폼 처리: React Hook Form + Zod + Server Action 패턴
- `revalidatePath()` 또는 `revalidateTag()` 사용하여 캐시 갱신

---

## 10. 코드 품질 규칙

### 명명 규칙

- 컴포넌트: PascalCase (`QuoteCard`, `StatusBadge`)
- 함수/변수: camelCase (`fetchQuotes`, `quoteId`)
- 파일명: kebab-case (`quote-card.tsx`, `status-badge.tsx`)
- 상수: SCREAMING_SNAKE_CASE (`MAX_ITEMS`)
- 한국어 주석, 영어 식별자

### 임포트 순서

```typescript
// 1. React/Next.js
import { Suspense } from 'react'
import { notFound } from 'next/navigation'

// 2. 외부 라이브러리
import { cn } from '@/lib/utils'

// 3. 내부 컴포넌트/유틸
import { Button } from '@/components/ui/button'
import { fetchQuote } from '@/lib/notion'
```

### 검증 체크리스트

```bash
npm run check-all   # typecheck + lint + format 통합 검사
npm run build       # 빌드 성공 확인
```

---

## 11. AI 의사결정 기준

### 컴포넌트 위치 결정

1. 단일 페이지에서만 사용 → `app/[route]/_components/`
2. 2개 이상 페이지에서 사용 → `components/` 적절한 폴더
3. UI 프리미티브 → `components/ui/` (shadcn만, 직접 생성 금지)

### 데이터 페칭 위치 결정

1. 목록/상세 조회 → RSC에서 직접 `async/await`
2. 사용자 액션 기반 변경 → Server Action
3. 실시간 업데이트 필요 → SWR/React Query (현재 미설치, 설치 후 사용)

### 새 기능 추가 순서

1. `src/lib/types.ts`에 타입 정의
2. Notion API 파싱 함수 구현 (`src/lib/notion.ts`)
3. Server Component/Action 구현
4. UI 컴포넌트 구현
5. `npm run check-all` 통과 확인

---

## 12. 금지 사항

- `any` 타입 사용 **금지**
- `components/ui/` 파일 직접 수정 **금지**
- 클라이언트 컴포넌트에서 Notion API 직접 호출 **금지**
- `style={}` 인라인 스타일 **금지** (Tailwind 클래스 사용)
- 환경 변수 `process.env.XXX` 직접 접근 **금지** (`src/lib/env.ts` 경유 필수)
- 새 색상 하드코딩 **금지** (CSS 변수 사용)
- `components/ui/` 폴더에 커스텀 컴포넌트 생성 **금지**
- shadcn 컴포넌트 수동 파일 생성 **금지** (`npx shadcn@latest add` 사용)
- `console.log` 프로덕션 코드에 남기기 **금지**
- 불필요한 `'use client'` 추가 **금지** (RSC 우선)
