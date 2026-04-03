// 견적서 뷰어 페이지 (클라이언트용)
// 클라이언트가 공유 URL로 접속하여 견적서를 확인하고 PDF로 저장하는 페이지 (F002, F003, F004, F007, F008, F009)

import { notFound } from 'next/navigation'
import { MOCK_QUOTES } from '@/lib/mock-data'
import { Container } from '@/components/layout/container'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/quote/status-badge'
import { PdfDownloadButton } from '@/components/quote/pdf-download-button'
import { SupplierInfoCard } from '@/components/quote/supplier-info'
import { QuoteItemsTable } from '@/components/quote/quote-items-table'
import { QuoteTotalRow } from '@/components/quote/quote-total-row'

interface ViewerPageProps {
  params: Promise<{ quoteNumber: string }>
}

export default async function ViewerPage({ params }: ViewerPageProps) {
  const { quoteNumber } = await params

  // MOCK_QUOTES에서 quoteNumber로 견적서 조회
  const quote = MOCK_QUOTES.find(q => q.quoteNumber === quoteNumber)

  // 견적서를 찾지 못한 경우 404
  if (!quote) {
    notFound()
  }

  return (
    <main className="bg-muted/30 min-h-screen py-8">
      {/* 컨트롤 바: 인쇄 시 숨김 */}
      <div className="mb-6 print:hidden">
        <Container size="md">
          <div className="flex items-center justify-between">
            <StatusBadge status={quote.status} />
            <PdfDownloadButton quoteNumber={quote.quoteNumber} />
          </div>
        </Container>
      </div>

      {/* A4 문서 영역 */}
      <Container size="sm">
        <div
          className={[
            'mx-auto w-full rounded-lg bg-white p-8 shadow-lg',
            'md:min-h-[297mm] md:max-w-[210mm] md:p-12',
            'print:rounded-none print:shadow-none',
          ].join(' ')}
        >
          {/* 공급자 정보 */}
          <SupplierInfoCard supplierInfo={quote.supplierInfo} />

          <Separator className="my-6" />

          {/* 견적서 제목 */}
          <h1 className="mb-6 text-center text-2xl font-bold tracking-widest">
            견 적 서
          </h1>

          {/* 견적서 기본 정보 */}
          <dl className="mb-6 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div className="flex gap-2">
              <dt className="text-muted-foreground min-w-[4rem]">견적번호</dt>
              <dd className="font-medium">{quote.quoteNumber}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted-foreground min-w-[4rem]">클라이언트</dt>
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

          <Separator className="mb-6" />

          {/* 견적 품목 테이블 */}
          <QuoteItemsTable items={quote.items} />

          {/* 합계 */}
          <div className="mt-4">
            <QuoteTotalRow totalAmount={quote.totalAmount} />
          </div>

          {/* 메모: 값이 있을 때만 렌더링 */}
          {quote.memo && (
            <div className="bg-muted/30 mt-6 rounded-lg p-4">
              <p className="text-muted-foreground mb-1 text-xs font-medium">
                메모
              </p>
              <p className="text-sm">{quote.memo}</p>
            </div>
          )}

          {/* 유효기간 안내 */}
          <div className="text-muted-foreground mt-8 text-center text-xs">
            <p>본 견적서의 유효기간은 {quote.expiryDate}까지입니다.</p>
          </div>
        </div>
      </Container>
    </main>
  )
}
