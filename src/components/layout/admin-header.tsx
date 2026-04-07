'use client'

// 관리자 대시보드 모바일 상단 헤더 컴포넌트
// md 이상 화면에서는 숨겨지고 모바일에서만 표시

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminHeaderProps {
  onMenuOpen: () => void
}

export function AdminHeader({ onMenuOpen }: AdminHeaderProps) {
  return (
    // 모바일 전용 헤더 - md 이상에서는 숨김
    <header className="bg-background sticky top-0 z-50 flex h-14 items-center border-b px-4 md:hidden">
      {/* 좌측: 모바일 메뉴 열기 버튼 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuOpen}
        aria-label="메뉴 열기"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* 중앙: 서비스명 */}
      <div className="flex flex-1 items-center justify-center">
        <span className="text-sm font-semibold">견적서 관리</span>
      </div>

      {/* 우측: 균형을 위한 빈 공간 */}
      <div className="w-9" />
    </header>
  )
}
