// 견적서 목록 페이지 (F001, F007, F009)
// Notion API 연동 전 MOCK_QUOTES 데이터를 사용하여 렌더링

import { MOCK_QUOTES } from '@/lib/mock-data'
import { Container } from '@/components/layout/container'
import { QuoteListTable } from '@/components/quote/quote-list-table'
import { QuoteListCards } from '@/components/quote/quote-list-cards'
import { QuoteEmptyState } from '@/components/quote/quote-empty-state'

export default function QuoteListPage() {
  // 추후 Notion API로 교체 예정
  const quotes = MOCK_QUOTES

  return (
    <main className="py-8">
      <Container size="lg">
        {/* 페이지 제목 */}
        <div className="mb-6">
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
      </Container>
    </main>
  )
}
