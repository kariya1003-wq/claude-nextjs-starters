// 견적서 목록 테이블 컴포넌트 (RSC) - 데스크톱 전용
// 견적서 목록을 테이블 형식으로 표시 (md 이상 화면)

import Link from 'next/link'
import { type Quote } from '@/lib/types'
import { StatusBadge } from '@/components/quote/status-badge'
import { QuoteCopyLinkButton } from '@/components/quote/quote-copy-link-button'

interface QuoteListTableProps {
  quotes: Quote[]
}

export function QuoteListTable({ quotes }: QuoteListTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40 border-b">
            <th className="text-muted-foreground px-5 py-3.5 text-left text-xs font-semibold tracking-wide uppercase">
              견적번호
            </th>
            <th className="text-muted-foreground px-5 py-3.5 text-left text-xs font-semibold tracking-wide uppercase">
              클라이언트명
            </th>
            <th className="text-muted-foreground px-5 py-3.5 text-left text-xs font-semibold tracking-wide uppercase">
              발행일
            </th>
            <th className="text-muted-foreground px-5 py-3.5 text-left text-xs font-semibold tracking-wide uppercase">
              만료일
            </th>
            <th className="text-muted-foreground px-5 py-3.5 text-left text-xs font-semibold tracking-wide uppercase">
              상태
            </th>
            {/* 클라이언트 링크 복사 컬럼 */}
            <th className="text-muted-foreground px-5 py-3.5 text-left text-xs font-semibold tracking-wide uppercase">
              링크
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {quotes.map(quote => (
            // 전체 행 클릭 가능: after:absolute after:inset-0 패턴
            <tr
              key={quote.id}
              className="group hover:bg-muted/30 relative transition-colors"
            >
              <td className="px-5 py-4">
                {/* 첫 번째 셀에 전체 행을 감싸는 링크 */}
                <Link
                  href={`/quotes/${quote.quoteNumber}`}
                  className="font-semibold after:absolute after:inset-0"
                >
                  {quote.quoteNumber}
                </Link>
              </td>
              <td className="px-5 py-4">{quote.clientName}</td>
              <td className="text-muted-foreground px-5 py-4">
                {quote.issueDate}
              </td>
              <td className="text-muted-foreground px-5 py-4">
                {quote.expiryDate}
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={quote.status} />
              </td>
              {/* 링크 복사 버튼: QuoteCopyLinkButton 내부에서 이벤트 전파 차단 */}
              <td className="relative z-10 px-5 py-4">
                <QuoteCopyLinkButton
                  quoteNumber={quote.quoteNumber}
                  isPublic={quote.isPublic}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
