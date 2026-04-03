// 견적서 품목 테이블 컴포넌트 (RSC)
// 품목명, 수량, 단가, 합계를 테이블 형식으로 표시

import { type QuoteItem } from '@/lib/types'
import { formatKRW } from '@/lib/utils'

interface QuoteItemsTableProps {
  items: QuoteItem[]
}

export function QuoteItemsTable({ items }: QuoteItemsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-muted-foreground py-3 pr-4 text-left font-medium">
              품목명
            </th>
            {/* 단가 컬럼: 모바일에서 숨김 */}
            <th className="text-muted-foreground hidden py-3 pr-4 text-right font-medium sm:table-cell">
              단가
            </th>
            <th className="text-muted-foreground py-3 pr-4 text-right font-medium">
              수량
            </th>
            <th className="text-muted-foreground py-3 text-right font-medium">
              합계
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item, index) => (
            <tr key={index} className="group">
              <td className="py-3 pr-4 font-medium">{item.name}</td>
              {/* 단가 컬럼: 모바일에서 숨김 */}
              <td className="text-muted-foreground hidden py-3 pr-4 text-right sm:table-cell">
                {formatKRW(item.unitPrice)}
              </td>
              <td className="text-muted-foreground py-3 pr-4 text-right">
                {item.quantity}
              </td>
              <td className="py-3 text-right font-medium">
                {formatKRW(item.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
