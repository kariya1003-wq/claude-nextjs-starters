// 견적서 목록 카드 컴포넌트 (RSC) - 모바일 전용
// 견적서 목록을 카드 형식으로 표시 (md 미만 화면)

import Link from 'next/link'
import { type Quote } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/quote/status-badge'

interface QuoteListCardsProps {
  quotes: Quote[]
}

export function QuoteListCards({ quotes }: QuoteListCardsProps) {
  return (
    <div className="flex flex-col gap-3">
      {quotes.map(quote => (
        <Link
          key={quote.id}
          href={`/quotes/${quote.quoteNumber}`}
          className="block"
        >
          <Card className="hover:bg-muted/30 transition-colors duration-150">
            <CardContent className="py-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {/* 견적번호 */}
                  <p className="text-muted-foreground text-xs font-medium tracking-wide">
                    {quote.quoteNumber}
                  </p>
                  {/* 클라이언트명 */}
                  <p className="mt-1 truncate text-base font-semibold">
                    {quote.clientName}
                  </p>
                  {/* 발행일 ~ 만료일 */}
                  <p className="text-muted-foreground mt-1.5 text-xs">
                    {quote.issueDate} ~ {quote.expiryDate}
                  </p>
                </div>
                {/* 상태 배지 */}
                <div className="pt-0.5">
                  <StatusBadge status={quote.status} />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
