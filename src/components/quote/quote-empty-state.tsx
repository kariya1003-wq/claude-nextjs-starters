// 견적서 빈 목록 상태 컴포넌트 (RSC)
// 등록된 견적서가 없을 때 표시하는 안내 UI

import { FileX } from 'lucide-react'

export function QuoteEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <FileX className="text-muted-foreground mb-4 size-12" />
      <p className="text-muted-foreground text-base font-medium">
        등록된 견적서가 없습니다
      </p>
      <p className="text-muted-foreground mt-1 text-sm">
        Notion DB에서 견적서를 추가하면 여기에 표시됩니다.
      </p>
    </div>
  )
}
