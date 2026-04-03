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
  draft: 'border-transparent bg-gray-100 text-gray-700 hover:bg-gray-100/80',
  sent: 'border-transparent bg-blue-100 text-blue-700 hover:bg-blue-100/80',
  confirmed:
    'border-transparent bg-green-100 text-green-700 hover:bg-green-100/80',
  expired: 'border-transparent bg-red-100 text-red-700 hover:bg-red-100/80',
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
      className={cn(STATUS_CLASSES[status], className)}
      aria-label={`견적서 상태: ${label}`}
    >
      {label}
    </Badge>
  )
}
