'use client'

// PDF 다운로드 버튼 컴포넌트 (클라이언트 컴포넌트)
// Phase 4에서 실제 PDF 생성 및 다운로드 기능 구현 예정

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PdfDownloadButtonProps {
  quoteNumber: string
}

export function PdfDownloadButton({ quoteNumber }: PdfDownloadButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      // Phase 4 구현 예정: quoteNumber를 사용하여 PDF 생성 및 다운로드
      onClick={() => {
        console.log('TODO Phase 4: download PDF for', quoteNumber)
      }}
    >
      <Download />
      PDF 다운로드
    </Button>
  )
}
