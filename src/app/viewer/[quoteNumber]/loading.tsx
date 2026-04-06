// 견적서 뷰어 페이지 로딩 스켈레톤
// Notion API 응답 대기 중 A4 레이아웃과 동일한 구조로 표시

import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Container } from '@/components/layout/container'

export default function ViewerLoading() {
  return (
    <main className="bg-muted/30 min-h-screen pb-12">
      {/* 컨트롤바 스켈레톤 */}
      <div className="bg-background/80 sticky top-0 z-10 mb-8 border-b backdrop-blur-sm">
        <Container size="sm">
          <div className="flex items-center justify-end gap-3 py-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </Container>
      </div>

      {/* A4 카드 스켈레톤 */}
      <Container size="sm">
        <div className="mx-auto w-full rounded-lg bg-white p-8 shadow-lg md:min-h-[297mm] md:max-w-[210mm] md:p-12">
          {/* 공급자 정보 스켈레톤 */}
          <div className="mb-2 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>

          <Separator className="my-6" />

          {/* 제목 스켈레톤 */}
          <div className="mb-6 flex justify-center">
            <Skeleton className="h-8 w-32" />
          </div>

          {/* 기본 정보 4개 (2×2) 스켈레톤 */}
          <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>

          <Separator className="mb-6" />

          {/* 품목 테이블 스켈레톤 */}
          <div className="space-y-0">
            {/* 헤더 */}
            <div className="flex gap-4 border-b py-3.5">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="hidden h-4 w-20 sm:block" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-20" />
            </div>
            {/* 품목 행 3개 */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 border-b py-4">
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="hidden h-4 w-20 sm:block" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>

          {/* 합계 행 스켈레톤 */}
          <div className="mt-4 flex justify-end gap-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
      </Container>
    </main>
  )
}
