// 견적서 합계 행 컴포넌트 (RSC)
// 견적서 하단에 총 합계 금액을 표시

import { formatKRW } from '@/lib/utils'

interface QuoteTotalRowProps {
  totalAmount: number
}

export function QuoteTotalRow({ totalAmount }: QuoteTotalRowProps) {
  return (
    <div className="flex items-center justify-end gap-6 border-t pt-4">
      <span className="text-muted-foreground text-sm font-semibold">합 계</span>
      <span className="text-lg font-bold">{formatKRW(totalAmount)}</span>
    </div>
  )
}
