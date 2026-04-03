// 견적서 목록 테이블 컴포넌트 (RSC) - 데스크톱 전용
// 견적서 목록을 테이블 형식으로 표시 (md 이상 화면)

import Link from 'next/link'
import { type Quote } from '@/lib/types'
import { StatusBadge } from '@/components/quote/status-badge'

interface QuoteListTableProps {
  quotes: Quote[]
}

export function QuoteListTable({ quotes }: QuoteListTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50 border-b">
            <th className="text-muted-foreground px-4 py-3 text-left font-medium">
              견적번호
            </th>
            <th className="text-muted-foreground px-4 py-3 text-left font-medium">
              클라이언트명
            </th>
            <th className="text-muted-foreground px-4 py-3 text-left font-medium">
              발행일
            </th>
            <th className="text-muted-foreground px-4 py-3 text-left font-medium">
              만료일
            </th>
            <th className="text-muted-foreground px-4 py-3 text-left font-medium">
              상태
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {quotes.map(quote => (
            // 전체 행 클릭 가능: after:absolute after:inset-0 패턴
            <tr key={quote.id} className="group hover:bg-muted/50 relative">
              <td className="px-4 py-3">
                {/* 첫 번째 셀에 전체 행을 감싸는 링크 */}
                <Link
                  href={`/quotes/${quote.quoteNumber}`}
                  className="font-medium after:absolute after:inset-0"
                >
                  {quote.quoteNumber}
                </Link>
              </td>
              <td className="text-muted-foreground px-4 py-3">
                {quote.clientName}
              </td>
              <td className="text-muted-foreground px-4 py-3">
                {quote.issueDate}
              </td>
              <td className="text-muted-foreground px-4 py-3">
                {quote.expiryDate}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={quote.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
