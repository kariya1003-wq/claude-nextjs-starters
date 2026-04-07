'use client'

// 견적서 목록에서 클라이언트 공유 링크를 복사하는 컴팩트 버튼
// 비공개 견적서(isPublic=false)는 복사 불가, 테이블/카드 행 클릭 이벤트와 분리 처리

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface QuoteCopyLinkButtonProps {
  quoteNumber: string
  /** 공개 견적서 여부 (false면 복사 불가) */
  isPublic: boolean
}

export function QuoteCopyLinkButton({
  quoteNumber,
  isPublic,
}: QuoteCopyLinkButtonProps) {
  // 복사 완료 상태 관리 (2초 후 원래 아이콘으로 복원)
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    // 테이블 행 전체 Link 클릭 이벤트 방지
    e.preventDefault()
    e.stopPropagation()

    // 비공개 견적서는 링크 공유 불가
    if (!isPublic) {
      toast.error('비공개 견적서는 링크를 공유할 수 없습니다.')
      return
    }

    // 뷰어 URL 생성 (환경변수 우선, 없으면 현재 origin 사용)
    const url = `${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/viewer/${quoteNumber}`

    try {
      await navigator.clipboard.writeText(url)
      toast.success('클라이언트 링크가 복사되었습니다.')
      setCopied(true)
      // 2초 후 아이콘 원래 상태로 복원
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('링크 복사에 실패했습니다.')
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      title={isPublic ? '클라이언트 링크 복사' : '비공개 견적서 (복사 불가)'}
      className={cn(
        'relative z-10 h-8 w-8',
        !isPublic && 'cursor-not-allowed opacity-30'
      )}
    >
      {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
    </Button>
  )
}
