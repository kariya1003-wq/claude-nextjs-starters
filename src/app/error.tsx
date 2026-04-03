'use client'

// 견적서 목록 페이지 에러 바운더리
// Next.js App Router error.tsx - 데이터 로딩 실패 시 표시

import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ reset }: ErrorProps) {
  return (
    <main className="py-8">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="text-destructive h-12 w-12" />
        <div>
          <h2 className="text-lg font-semibold">오류가 발생했습니다</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            데이터를 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
        <Button variant="outline" onClick={reset}>
          다시 시도
        </Button>
      </div>
    </main>
  )
}
