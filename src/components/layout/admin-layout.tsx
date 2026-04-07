'use client'

// 관리자 대시보드 레이아웃 컴포넌트
// 데스크톱: 고정 사이드바 + 메인 콘텐츠
// 모바일: Sheet 기반 드로어 + 모바일 헤더

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { AdminHeader } from '@/components/layout/admin-header'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  // 데스크톱 사이드바 접힘 상태
  const [collapsed, setCollapsed] = useState(false)
  // 모바일 Sheet 열림 상태
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      {/* 데스크톱 사이드바 - md 이상에서만 표시 */}
      <aside className="hidden flex-col border-r md:flex">
        <AdminSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(v => !v)}
        />
      </aside>

      {/* 모바일 Sheet 사이드바 */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          {/* 접근성을 위한 숨김 헤더 */}
          <SheetHeader className="sr-only">
            <SheetTitle>내비게이션</SheetTitle>
          </SheetHeader>
          <AdminSidebar
            collapsed={false}
            onToggle={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 모바일 전용 상단 헤더 */}
        <AdminHeader onMenuOpen={() => setMobileOpen(true)} />
        {/* 스크롤 가능한 메인 콘텐츠 */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
