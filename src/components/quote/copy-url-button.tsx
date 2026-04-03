'use client'

// URL 복사 버튼 컴포넌트 (클라이언트 컴포넌트)
// Phase 3에서 실제 클립보드 복사 기능 구현 예정

import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CopyUrlButtonProps {
  quoteNumber: string
}

export function CopyUrlButton({ quoteNumber }: CopyUrlButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      // Phase 3 구현 예정: quoteNumber를 사용하여 클립보드에 뷰어 URL 복사
      onClick={() => {
        console.log('TODO Phase 3: copy viewer URL for', quoteNumber)
      }}
    >
      <Copy />
      URL 복사
    </Button>
  )
}
