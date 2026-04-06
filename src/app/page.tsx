// 견적서 목록 페이지 (F001, F007, F009)
// Notion API에서 견적서 목록을 조회하여 렌더링

import { fetchQuotes } from '@/lib/notion'

// 목록 페이지: 30초마다 ISR 재생성 (목록은 약간의 지연 허용)
export const revalidate = 30
import { Container } from '@/components/layout/container'
import { QuoteListTable } from '@/components/quote/quote-list-table'
import { QuoteListCards } from '@/components/quote/quote-list-cards'
import { QuoteEmptyState } from '@/components/quote/quote-empty-state'

export default async function QuoteListPage() {
  // Notion API에서 견적서 목록 조회 (미설정 시 빈 배열 반환)
  const quotes = await fetchQuotes()

  return (
    <main className="py-8">
      <Container size="md">
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
