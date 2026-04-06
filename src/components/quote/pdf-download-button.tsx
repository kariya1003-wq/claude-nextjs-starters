'use client'

// PDF 다운로드 버튼 컴포넌트 (클라이언트 컴포넌트)
// API Route를 통해 puppeteer로 생성된 PDF를 다운로드

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface PdfDownloadButtonProps {
  quoteNumber: string
}

export function PdfDownloadButton({ quoteNumber }: PdfDownloadButtonProps) {
  // PDF 생성 중 로딩 상태 관리
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleDownload = async () => {
    setIsLoading(true)

    try {
      // PDF 생성 API 호출
      const response = await fetch(`/api/pdf/${quoteNumber}`)

      // HTTP 상태코드별 에러 메시지 분기
      if (response.status === 403) {
        toast.error('접근 권한이 없는 견적서입니다.')
        return
      }
      if (response.status === 404) {
        toast.error('견적서를 찾을 수 없습니다.')
        return
      }
      if (!response.ok) {
        toast.error('PDF 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.')
        return
      }

      // blob으로 변환 후 가상 링크 클릭으로 다운로드
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `quote-${quoteNumber}.pdf`
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)

      // 메모리 해제
      URL.revokeObjectURL(url)

      // 다운로드 완료 알림
      toast.success(`PDF가 저장되었습니다.`, {
        description: `quote-${quoteNumber}.pdf`,
      })
    } catch {
      toast.error('PDF 생성에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : <Download />}
      PDF 다운로드
    </Button>
  )
}
