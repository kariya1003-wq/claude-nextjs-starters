'use client'

// URL 복사 버튼 컴포넌트 (클라이언트 컴포넌트)
// 클립보드에 뷰어 URL을 복사하고 toast 피드백을 표시

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface CopyUrlButtonProps {
  quoteNumber: string
}

export function CopyUrlButton({ quoteNumber }: CopyUrlButtonProps) {
  // 복사 완료 상태 관리 (2초 후 원래 아이콘으로 복원)
  const [copied, setCopied] = useState<boolean>(false)

  const handleCopy = async () => {
    // 뷰어 URL 생성 (환경변수 우선, 없으면 현재 origin 사용)
    const url = `${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/viewer/${quoteNumber}`

    try {
      await navigator.clipboard.writeText(url)
      toast.success('URL이 클립보드에 복사되었습니다.')
      setCopied(true)
      // 2초 후 아이콘 원래 상태로 복원
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('URL 복사에 실패했습니다.')
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? <Check /> : <Copy />}
      URL 복사
    </Button>
  )
}
