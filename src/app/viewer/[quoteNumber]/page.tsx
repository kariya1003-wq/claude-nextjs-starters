// 견적서 뷰어 페이지 (클라이언트용)
// 클라이언트가 공유 URL로 접속하여 견적서를 확인하고 PDF로 저장하는 페이지 (F002, F003, F004, F007, F008, F009)

import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { fetchQuoteByNumber } from '@/lib/notion'
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

// OG 메타태그 동적 생성 (F008)
// React cache()로 래핑된 fetchQuoteByNumber 사용 → 아래 page 컴포넌트와 API 1회만 호출
export async function generateMetadata({
  params,
}: ViewerPageProps): Promise<Metadata> {
  const { quoteNumber } = await params
  const quote = await fetchQuoteByNumber(quoteNumber)

  if (!quote || !quote.isPublic) {
    return { title: '견적서 | 접근 불가' }
  }

  const title = `견적서 ${quoteNumber} | ${quote.clientName}`
  const description = `발행일: ${quote.issueDate} · 유효기간: ${quote.expiryDate}`
  const url = `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/viewer/${quoteNumber}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function ViewerPage({ params }: ViewerPageProps) {
  const { quoteNumber } = await params

  // Notion API에서 quoteNumber로 견적서 조회
  const quote = await fetchQuoteByNumber(quoteNumber)

  // 견적서를 찾지 못한 경우 404
  if (!quote) {
    notFound()
  }

  // 접근 제한 판단 (redirect는 Next.js 내부적으로 throw하므로 try/catch 밖에서 호출)
  if (quote.status === 'expired') {
    redirect('/restricted?reason=expired')
  }
  if (!quote.isPublic || quote.status === 'draft') {
    redirect('/restricted?reason=private')
  }

  return (
    <main className="bg-muted/30 min-h-screen pb-12">
      {/* 컨트롤 바: 상태 배지 표시, 인쇄 시 숨김 */}
      {/* size="sm" 으로 A4 문서 영역과 동일한 너비 적용 */}
      <div className="bg-background/80 sticky top-0 z-10 mb-8 border-b backdrop-blur-sm print:hidden">
        <Container size="sm">
          <div className="flex items-center justify-end gap-3 py-3">
            <span className="text-muted-foreground text-sm font-medium">
              {quote.quoteNumber}
            </span>
            <StatusBadge status={quote.status} />
          </div>
        </Container>
      </div>

      {/* A4 문서 + PDF 버튼 영역 */}
      <Container size="sm">
        {/* A4 문서 */}
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

          {/* PDF 다운로드 버튼: 카드 내부 하단 중앙, 인쇄 시 숨김 */}
          <div className="mt-8 flex justify-center print:hidden">
            <PdfDownloadButton quoteNumber={quote.quoteNumber} />
          </div>
        </div>
      </Container>
    </main>
  )
}
