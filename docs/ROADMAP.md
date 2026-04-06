# 노션 기반 견적서 웹뷰어 개발 로드맵

> 노션 DB의 견적서 데이터를 전용 URL로 즉시 공유하고 PDF로 다운로드할 수 있는 웹 애플리케이션

## 개요

이 프로젝트는 1인 프리랜서 및 소규모 사업자가 노션에 입력한 견적서를 클라이언트에게 깔끔한 웹 페이지로 공유하고, PDF로 다운로드할 수 있게 하는 Next.js 15.5.3 기반 웹 애플리케이션입니다.

### 핵심 기능

- **견적서 목록 조회** (F001) - Notion API를 통한 전체 견적서 목록 서버 렌더링
- **견적서 상세 조회** (F002) - 특정 견적서의 전체 필드 조회 및 표시
- **견적서 웹 렌더링** (F003) - 조회 데이터를 견적서 양식으로 렌더링
- **PDF 다운로드** (F004) - puppeteer 기반 서버사이드 PDF 생성
- **접근 제한 처리** (F005) - 비공개/만료 견적서 접근 차단
- **고유 URL 생성/복사** (F006) - 견적번호 기반 공유 URL 클립보드 복사
- **상태 배지 표시** (F007) - 초안/발송/확정/만료 컬러 배지
- **OG 메타태그** (F008) - 링크 공유 시 미리보기 설정
- **모바일 반응형** (F009) - 모든 페이지 모바일 대응

## 개발 워크플로우

1. **작업 계획** - 코드베이스 파악, ROADMAP.md 확인 및 업데이트
2. **작업 생성** - `/tasks` 디렉토리에 작업 파일 생성 (`XXX-description.md` 형식)
3. **작업 구현** - 명세서에 따라 구현, API 연동 시 Playwright MCP로 테스트
4. **로드맵 업데이트** - 완료 작업 ✅ 표시

---

## 개발 단계

### Phase 1: 애플리케이션 골격 구축 ✅

> 전체 라우트 구조, 타입 정의, 기본 설정을 완성하여 앱의 뼈대를 잡는 단계

- **Task 001: 견적서 데이터 모델 및 TypeScript 타입 정의** ✅ - 완료
  - ✅ Notion DB 필드 기반 `Quote` 인터페이스 정의 (quoteNumber, clientName, issueDate, expiryDate, items, supplierInfo, memo, status, isPublic)
  - ✅ 견적서 상태 enum 타입 정의 (초안/발송/확정/만료)
  - ✅ 품목(item) 타입 정의 (품목명, 수량, 단가, 합계)
  - ✅ 공급자 정보(supplierInfo) 타입 정의 (회사명, 담당자, 연락처)
  - ✅ Zod 스키마로 Notion API 응답 유효성 검사 스키마 작성

- **Task 002: 전체 라우트 구조 및 빈 페이지 생성** ✅ - 완료
  - ✅ 견적서 목록 페이지 라우트 정리 (`/` → `app/page.tsx`, 이미 존재)
  - ✅ 견적서 상세 페이지 라우트 생성 (`/quotes/[quoteNumber]` → `app/quotes/[quoteNumber]/page.tsx`)
  - ✅ 견적서 뷰어 페이지 라우트 생성 (`/viewer/[quoteNumber]` → `app/viewer/[quoteNumber]/page.tsx`)
  - ✅ 접근 제한 안내 페이지 라우트 생성 (`/restricted` → `app/restricted/page.tsx`)
  - ✅ 각 페이지에 기본 플레이스홀더 콘텐츠 배치

- **Task 003: Notion API 클라이언트 설정 및 환경 변수 구성** ✅ - 완료
  - ✅ `@notionhq/client` 패키지 설치 및 클라이언트 인스턴스 생성 (`lib/notion.ts`)
  - ✅ 환경 변수 설정 (NOTION_API_KEY, NOTION_DATABASE_ID)
  - ✅ `.env.local.example` 파일 작성으로 필요한 환경 변수 문서화
  - ✅ Zod를 활용한 환경 변수 유효성 검사 (`lib/env.ts` 확장)
  - ✅ Notion API 응답을 앱 내부 타입으로 변환하는 매퍼 함수 작성

- **Task 004: 헤더 내비게이션 및 레이아웃 업데이트** ✅ - 완료
  - ✅ 헤더에 서비스명(로고) 및 "견적서 목록" 메뉴 링크 추가
  - ✅ 뷰어 페이지(`/viewer/*`)에서는 공급자용 내비게이션 숨김 처리
  - ✅ 접근 제한 페이지에서 내비게이션 숨김 처리
  - ✅ 루트 레이아웃에 조건부 헤더 렌더링 로직 적용

---

### Phase 2: UI/UX 완성 (더미 데이터 활용) ✅

> 더미 데이터로 모든 페이지의 UI를 완성하여 전체 앱 플로우를 체험할 수 있는 단계

- **Task 005: 견적서 상태 배지 공통 컴포넌트 구현** ✅ - 완료 (F007)
  - ✅ shadcn/ui Badge 컴포넌트 기반 상태 배지 생성 (`components/quote/status-badge.tsx`)
  - ✅ 상태별 컬러 매핑 (초안: 회색, 발송: 파랑, 확정: 초록, 만료: 빨강)
  - ✅ CVA(Class Variance Authority)로 배지 변형 관리
  - ✅ 접근성을 위한 aria-label 적용

- **Task 006: 견적서 목록 페이지 UI 구현** ✅ - 완료 (F001, F007, F009)
  - ✅ 더미 견적서 데이터 배열 생성 (7건, mock-data.ts)
  - ✅ 데스크톱용 테이블 레이아웃 구현 (견적번호, 클라이언트명, 발행일, 상태 배지)
  - ✅ 모바일용 카드 레이아웃 구현 (테이블 → 카드 반응형 전환)
  - ✅ 각 행/카드 클릭 시 상세 페이지(`/quotes/[quoteNumber]`)로 이동 링크 적용
  - ✅ 빈 목록 상태 UI 처리

- **Task 007: 견적서 상세 페이지 UI 구현** ✅ - 완료 (F002, F006, F007, F009)
  - ✅ 더미 데이터로 공급자 정보, 클라이언트명, 품목 테이블, 합계, 메모 렌더링
  - ✅ 품목 테이블 구현 (품목명, 수량, 단가, 합계 컬럼)
  - ✅ 상태 배지 표시 및 뒤로가기(목록으로) 버튼 배치
  - ✅ "URL 복사" 버튼 UI 배치 (클립보드 복사 기능은 Phase 3에서 구현)
  - ✅ 모바일 반응형 레이아웃 적용

- **Task 008: 견적서 뷰어 페이지 UI 구현** ✅ - 완료 (F003, F007, F009)
  - ✅ 더미 데이터로 견적서 양식 전체 렌더링 (공급자 정보, 클라이언트명, 품목 테이블, 총액, 유효기간, 메모)
  - ✅ 인쇄/PDF 친화적인 견적서 레이아웃 설계 (A4 비율: md:max-w-[210mm])
  - ✅ 상태 배지 표시 및 "PDF 다운로드" 버튼 UI 배치
  - ✅ 모바일 반응형 레이아웃 적용
  - ✅ 공급자용 내비게이션이 숨겨진 클라이언트 전용 레이아웃 확인

- **Task 009: 접근 제한 안내 페이지 UI 구현** ✅ - 완료 (F005)
  - ✅ "견적서에 접근할 수 없습니다" 안내 메시지 렌더링
  - ✅ 접근 불가 사유 표시 (만료 또는 비공개 처리됨)
  - ✅ 공급자 문의 유도 안내 문구 배치
  - ✅ reason 쿼리 파라미터에 따른 사유 분기 처리 (expired / private)
  - ✅ 모바일 반응형 레이아웃 적용

---

### Phase 3: 핵심 기능 구현 ✅

> Notion API 연동, 접근 제어, PDF 생성 등 핵심 비즈니스 로직을 구현하는 단계

- **Task 010: Notion API 견적서 목록 조회 구현** ✅ - 완료 (F001)
  - ✅ Notion Database Query API로 전체 견적서 목록 조회 Server Action 구현
  - ✅ API 응답을 Zod 스키마로 유효성 검사 후 내부 타입으로 변환
  - ✅ 목록 페이지에서 더미 데이터를 실제 API 데이터로 교체
  - ✅ 에러 핸들링 및 로딩 상태 처리 (error.tsx, loading.tsx)

- **Task 011: Notion API 견적서 상세 조회 구현** ✅ - 완료 (F002)
  - ✅ 견적번호 기준 Notion Database Query API로 단건 조회 함수 구현
  - ✅ 상세 페이지에서 더미 데이터를 실제 API 데이터로 교체
  - ✅ 뷰어 페이지에서 더미 데이터를 실제 API 데이터로 교체
  - ✅ 존재하지 않는 견적번호 접근 시 404 처리 (not-found.tsx)

- **Task 012: 접근 제한 로직 구현** ✅ - 완료 (F005)
  - ✅ 뷰어 페이지에서 isPublic 및 status 필드 기반 접근 가능 여부 판단
  - ✅ 접근 불가 시 접근 제한 안내 페이지로 리디렉션 (서버사이드 redirect)
  - ✅ 리디렉션 시 사유(reason) 쿼리 파라미터 전달 (expired / private)
  - ✅ 발송 또는 확정 상태이면서 isPublic=true인 경우에만 뷰어 접근 허용

- **Task 013: 고유 URL 생성 및 클립보드 복사 기능 구현** ✅ - 완료 (F006)
  - ✅ 견적번호 기반 고유 공유 URL 생성 로직 (`/viewer/[quoteNumber]`)
  - ✅ 클립보드 복사 클라이언트 컴포넌트 구현 (navigator.clipboard API)
  - ✅ 복사 성공/실패 시 토스트 알림 표시
  - ✅ URL 복사 버튼에 복사 완료 상태 피드백 (Copy → Check 아이콘 2초 전환)

- **Task 014: puppeteer 기반 PDF 다운로드 기능 구현** ✅ - 완료 (F004)
  - ✅ puppeteer 패키지 설치 및 서버사이드 설정
  - ✅ Next.js Route Handler (`/api/pdf/[quoteNumber]`)로 PDF 생성 API 구현
  - ✅ 뷰어 페이지 URL을 puppeteer로 렌더링 후 PDF 변환
  - ✅ A4 사이즈 PDF 출력 설정 (printBackground: true)
  - ✅ "PDF 다운로드" 버튼 클릭 시 API 호출 및 파일 다운로드 처리

---

### Phase 4: 고급 기능 및 최적화 ✅

> OG 메타태그, 성능 최적화, 배포 준비 등 마무리 단계

- **Task 015: OG 메타태그 동적 설정** ✅ - 완료 (F008)
  - ✅ 뷰어 페이지에 Next.js generateMetadata 함수로 동적 메타데이터 생성
  - ✅ 견적번호, 클라이언트명을 포함한 og:title, og:description 설정
  - ✅ og:type, og:url 등 기본 OG 태그 설정 (twitter:card 포함)
  - ✅ React cache()로 fetchQuoteByNumber 래핑 → generateMetadata + page 이중 API 호출 방지

- **Task 016: 성능 최적화 및 캐싱 전략 적용** ✅ - 완료
  - ✅ Notion API 호출에 Next.js fetch 캐싱 적용 (queryDatabase revalidate 파라미터 추가)
  - ✅ 목록 페이지 ISR(Incremental Static Regeneration) 적용 (revalidate: 30s)
  - ✅ 뷰어/상세 페이지는 no-store 유지 (접근 제어 실시간 반영)
  - ✅ serverExternalPackages 최적화 (lucide-react tree-shaking 등 기존 설정 활용)

- **Task 017: 에러 처리 및 사용자 경험 고도화** ✅ - 완료
  - ✅ 전역 error.tsx 개선 (useEffect console.error, Notion 장애 안내 메시지)
  - ✅ 전역 not-found.tsx 구현 (404 페이지 디자인)
  - ✅ Notion API 장애 시 graceful 에러 메시지 표시
  - ✅ 뷰어 페이지 loading.tsx 신규 생성 (A4 카드 스켈레톤)
  - ✅ PDF 다운로드 버튼 HTTP 상태코드별 에러 메시지 분기 (403/404/500)

- **Task 018: 배포 환경 구성 및 프로덕션 준비** ✅ - 완료
  - ✅ Vercel 배포 설정 및 환경 변수 구성 (vercel.json, .env.local.example)
  - ✅ puppeteer 서버리스 환경 호환성 확인 (@sparticuz/chromium-min 적용)
  - ✅ 프로덕션 빌드 테스트 (`npm run build` 통과 확인)
  - ✅ 로컬 환경 전체 기능 검증 (목록/상세/뷰어/접근제한 페이지)

---

## 진행 상황 요약

**📅 최종 업데이트**: 2026-04-06
**📊 진행 상황**: 전체 완료 (18/18 Tasks 완료, 100%)

| Phase                           | 진행 상태             | Task 수  |
| ------------------------------- | --------------------- | -------- |
| Phase 1: 애플리케이션 골격 구축 | ✅ 완료               | 4개      |
| Phase 2: UI/UX 완성             | ✅ 완료               | 5개      |
| Phase 3: 핵심 기능 구현         | ✅ 완료               | 5개      |
| Phase 4: 고급 기능 및 최적화    | ✅ 완료               | 4개      |
| **합계**                        | **18/18 완료 (100%)** | **18개** |
