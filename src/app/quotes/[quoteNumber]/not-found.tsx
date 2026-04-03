// 견적서 상세 페이지 커스텀 404
// 존재하지 않는 견적서 번호로 접근 시 표시

import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="py-16">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <FileQuestion className="text-muted-foreground h-16 w-16" />
        <div>
          <h2 className="text-xl font-semibold">견적서를 찾을 수 없습니다</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            요청하신 견적서 번호가 존재하지 않거나 삭제되었습니다.
          </p>
        </div>
        <Button asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </main>
  )
}
