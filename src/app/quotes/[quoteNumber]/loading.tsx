// 견적서 상세 페이지 로딩 스켈레톤
// Next.js App Router loading.tsx - 데이터 로딩 중 표시

import { Skeleton } from '@/components/ui/skeleton'
import { Container } from '@/components/layout/container'

export default function Loading() {
  return (
    <main className="py-8">
      <Container size="md">
        <div className="flex flex-col gap-6">
          {/* 상단 액션바 스켈레톤 */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>

          {/* 견적서 정보 카드 스켈레톤 */}
          <div className="rounded-lg border p-6">
            <Skeleton className="mb-4 h-5 w-24" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          </div>

          {/* 공급자 정보 카드 스켈레톤 */}
          <div className="rounded-lg border p-6">
            <Skeleton className="mb-4 h-5 w-24" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>

          {/* 품목 테이블 스켈레톤 */}
          <div className="rounded-lg border p-6">
            <Skeleton className="mb-4 h-5 w-24" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}
