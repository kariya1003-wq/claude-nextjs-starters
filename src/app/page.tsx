// 견적서 목록 페이지 (F001, F007, F009)
// Notion API에서 견적서 목록을 조회하여 관리자 레이아웃으로 렌더링

import { fetchQuotes } from '@/lib/notion'

// 목록 페이지: 30초마다 ISR 재생성 (목록은 약간의 지연 허용)
export const revalidate = 30

import { AdminLayout } from '@/components/layout/admin-layout'
import { QuoteListTable } from '@/components/quote/quote-list-table'
import { QuoteListCards } from '@/components/quote/quote-list-cards'
import { QuoteEmptyState } from '@/components/quote/quote-empty-state'
import { QuoteStatsCards } from '@/components/quote/quote-stats-cards'

export default async function QuoteListPage() {
  // Notion API에서 견적서 목록 조회 (미설정 시 빈 배열 반환)
  const quotes = await fetchQuotes()

  // 상태별 견적서 건수 집계
  const stats = {
    total: quotes.length,
    draft: quotes.filter(q => q.status === 'draft').length,
    sent: quotes.filter(q => q.status === 'sent').length,
    confirmed: quotes.filter(q => q.status === 'confirmed').length,
    expired: quotes.filter(q => q.status === 'expired').length,
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
