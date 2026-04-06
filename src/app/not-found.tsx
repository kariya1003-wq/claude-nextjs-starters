// 전역 404 페이지
// 존재하지 않는 경로 접근 시 표시 (Next.js App Router 자동 적용)

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* 404 대형 숫자 */}
        <p className="text-muted-foreground/30 mb-6 text-9xl font-black tracking-tight select-none">
          404
        </p>

        {/* 제목 */}
        <h1 className="mb-3 text-xl font-bold">페이지를 찾을 수 없습니다</h1>

        {/* 설명 */}
        <p className="text-muted-foreground mb-8 text-sm">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>

        {/* 홈으로 돌아가기 */}
        <Button asChild className="w-full max-w-xs">
          <Link href="/">견적서 목록으로 돌아가기</Link>
        </Button>
      </div>
    </main>
  )
}
