// 견적서 상세 페이지 (공급자용)
// 특정 견적서의 전체 내용을 미리 확인하고 클라이언트 공유 URL을 생성하는 페이지 (F002, F006, F007, F009)

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fetchQuoteByNumber } from '@/lib/notion'
import { Container } from '@/components/layout/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/quote/status-badge'
import { CopyUrlButton } from '@/components/quote/copy-url-button'
import { SupplierInfoCard } from '@/components/quote/supplier-info'
import { QuoteItemsTable } from '@/components/quote/quote-items-table'
import { QuoteTotalRow } from '@/components/quote/quote-total-row'

interface QuoteDetailPageProps {
  params: Promise<{ quoteNumber: string }>
}

export default async function QuoteDetailPage({
  params,
}: QuoteDetailPageProps) {
  const { quoteNumber } = await params

  // Notion API에서 quoteNumber로 견적서 조회
  const quote = await fetchQuoteByNumber(quoteNumber)

  // 견적서를 찾지 못한 경우 404
  if (!quote) {
    notFound()
  }

  return (
    <main className="py-8">
      <Container size="md">
        <div className="flex flex-col gap-6">
          {/* 상단 액션바 */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
            >
              ← 목록으로
            </Link>
            <div className="flex items-center gap-2">
              <StatusBadge status={quote.status} />
              <CopyUrlButton quoteNumber={quote.quoteNumber} />
            </div>
          </div>

          {/* 견적서 메타 정보 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">견적서 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div className="flex gap-2">
                  <dt className="text-muted-foreground min-w-[4rem]">
                    견적번호
                  </dt>
                  <dd className="font-medium">{quote.quoteNumber}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted-foreground min-w-[4rem]">
                    클라이언트
                  </dt>
                  <dd className="font-medium">{quote.clientName}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted-foreground min-w-[4rem]">발행일</dt>
                  <dd>{quote.issueDate}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted-foreground min-w-[4rem]">만료일</dt>
                  <dd>{quote.expiryDate}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* 공급자 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">공급자 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <SupplierInfoCard supplierInfo={quote.supplierInfo} />
            </CardContent>
          </Card>

          {/* 견적 품목 테이블 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">견적 품목</CardTitle>
            </CardHeader>
            <CardContent>
              <QuoteItemsTable items={quote.items} />
            </CardContent>
          </Card>

          {/* 합계 */}
          <QuoteTotalRow totalAmount={quote.totalAmount} />

          {/* 메모: 값이 있을 때만 렌더링 */}
          {quote.memo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">메모</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{quote.memo}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </main>
  )
}
