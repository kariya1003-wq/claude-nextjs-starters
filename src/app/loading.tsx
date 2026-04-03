// 견적서 목록 페이지 로딩 스켈레톤
// Next.js App Router loading.tsx - 데이터 로딩 중 표시

import { Skeleton } from '@/components/ui/skeleton'
import { Container } from '@/components/layout/container'

export default function Loading() {
  return (
    <main className="py-8">
      <Container size="lg">
        {/* 페이지 제목 스켈레톤 */}
        <div className="mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-1 h-4 w-36" />
        </div>

        {/* 데스크톱: 테이블 행 스켈레톤 5개 */}
        <div className="hidden space-y-2 md:block">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>

        {/* 모바일: 카드 스켈레톤 3개 */}
        <div className="space-y-3 md:hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </Container>
    </main>
  )
}
