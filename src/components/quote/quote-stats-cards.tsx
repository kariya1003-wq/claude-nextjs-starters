// 견적서 현황 통계 카드 컴포넌트 (RSC)
// 상태별 견적서 건수를 카드 그리드로 표시

import { CheckCircle2, FileEdit, Send, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface QuoteStats {
  total: number
  draft: number
  sent: number
  confirmed: number
  expired: number
}

interface QuoteStatsCardsProps {
  stats: QuoteStats
}

// 각 상태별 카드 설정 정의
const STAT_CARDS = [
  {
    key: 'draft' as const,
    label: '초안',
    icon: FileEdit,
    iconClassName: 'text-zinc-500',
  },
  {
    key: 'sent' as const,
    label: '발송',
    icon: Send,
    iconClassName: 'text-blue-500',
  },
  {
    key: 'confirmed' as const,
    label: '확정',
    icon: CheckCircle2,
    iconClassName: 'text-emerald-500',
  },
  {
    key: 'expired' as const,
    label: '만료',
    icon: XCircle,
    iconClassName: 'text-red-500',
  },
]

export function QuoteStatsCards({ stats }: QuoteStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {STAT_CARDS.map(({ key, label, icon: Icon, iconClassName }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-0">
            <Icon className={`h-4 w-4 shrink-0 ${iconClassName}`} />
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {label}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {/* 건수 및 단위 표시 */}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{stats[key]}</span>
              <span className="text-muted-foreground text-sm">건</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
