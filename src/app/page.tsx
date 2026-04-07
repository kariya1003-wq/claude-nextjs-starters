// 견적서 목록 페이지 (F001, F007, F009)
// Notion API에서 견적서 목록을 조회하여 관리자 레이아웃으로 렌더링

import { Suspense } from 'react'
import { fetchQuotes } from '@/lib/notion'
import type { QuoteStatus } from '@/lib/types'

// 목록 페이지: 30초마다 ISR 재생성 (목록은 약간의 지연 허용)
export const revalidate = 30

import { AdminLayout } from '@/components/layout/admin-layout'
import { QuoteListTable } from '@/components/quote/quote-list-table'
import { QuoteListCards } from '@/components/quote/quote-list-cards'
import { QuoteEmptyState } from '@/components/quote/quote-empty-state'
import { QuoteStatsCards } from '@/components/quote/quote-stats-cards'
import { QuoteFilterBar } from '@/components/quote/quote-filter-bar'

// Next.js 15: searchParams는 Promise 타입
interface PageProps {
  searchParams: Promise<{ status?: string; search?: string }>
}

export default async function QuoteListPage({ searchParams }: PageProps) {
  // searchParams는 Next.js 15에서 비동기로 처리
  const { status, search } = await searchParams

  // Notion API에서 필터 조건을 적용하여 견적서 목록 조회
  const quotes = await fetchQuotes({
    status: status as QuoteStatus | undefined,
    search,
  })

  // 통계용 전체 목록 조회 (필터 미적용 - 항상 전체 카운트 표시)
  const allQuotes = await fetchQuotes()

  // 상태별 견적서 건수 집계 (전체 기준)
  const stats = {
    total: allQuotes.length,
    draft: allQuotes.filter(q => q.status === 'draft').length,
    sent: allQuotes.filter(q => q.status === 'sent').length,
    confirmed: allQuotes.filter(q => q.status === 'confirmed').length,
    expired: allQuotes.filter(q => q.status === 'expired').length,
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* 상단: 상태별 통계 카드 */}
        <QuoteStatsCards stats={stats} />

        {/* 하단: 견적서 목록 */}
        <div>
          {/* 섹션 제목 */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold tracking-tight">견적서 목록</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              총 {quotes.length}건의 견적서가 있습니다.
            </p>
          </div>

          {/* 필터 바: useSearchParams 사용으로 Suspense 필요 */}
          <Suspense fallback={null}>
            <QuoteFilterBar />
          </Suspense>

          {/* 빈 상태 또는 견적서 목록 */}
          {quotes.length === 0 ? (
            <QuoteEmptyState />
          ) : (
            <>
              {/* 데스크톱: 테이블 뷰 */}
              <div className="hidden md:block">
                <QuoteListTable quotes={quotes} />
              </div>
              {/* 모바일: 카드 뷰 */}
              <div className="block md:hidden">
                <QuoteListCards quotes={quotes} />
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
