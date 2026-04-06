// 견적서 상태 배지 컴포넌트 (F007)
// 초안/발송/확정/만료 상태를 컬러 배지로 표시

import { Badge } from '@/components/ui/badge'
import { type QuoteStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

// 상태별 한국어 레이블
const STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: '초안',
  sent: '발송',
  confirmed: '확정',
  expired: '만료',
}

// 상태별 색상 클래스 (초안: 회색, 발송: 파랑, 확정: 초록, 만료: 빨강)
const STATUS_CLASSES: Record<QuoteStatus, string> = {
  draft:
    'border-transparent bg-zinc-100 text-zinc-600 hover:bg-zinc-100/80 font-semibold',
  sent: 'border-transparent bg-blue-50 text-blue-600 hover:bg-blue-50/80 font-semibold',
  confirmed:
    'border-transparent bg-emerald-50 text-emerald-700 hover:bg-emerald-50/80 font-semibold',
  expired:
    'border-transparent bg-red-50 text-red-600 hover:bg-red-50/80 font-semibold',
}

interface StatusBadgeProps {
  status: QuoteStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = STATUS_LABELS[status]

  return (
    <Badge
      variant="outline"
      className={cn(STATUS_CLASSES[status], 'rounded-full px-2.5', className)}
      aria-label={`견적서 상태: ${label}`}
    >
      {label}
    </Badge>
  )
}
