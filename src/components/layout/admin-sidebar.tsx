'use client'

// 관리자 대시보드 사이드바 컴포넌트
// 데스크톱 고정 사이드바, collapsed 상태에 따라 아이콘만/아이콘+텍스트 표시

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, FileText, LayoutList } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

// 내비게이션 메뉴 항목 정의
const NAV_ITEMS = [
  {
    icon: LayoutList,
    label: '견적서 목록',
    href: '/',
  },
]

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        'bg-sidebar text-sidebar-foreground flex h-full flex-col transition-all duration-200',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* 상단: 로고 및 서비스명 */}
      <div
        className={cn(
          'border-sidebar-border flex h-14 items-center border-b px-4',
          collapsed ? 'justify-center' : 'gap-3'
        )}
      >
        {/* 접힌 상태에서 aria-label로 접근성 처리 */}
        <FileText
          className="text-sidebar-primary h-6 w-6 shrink-0"
          aria-label={collapsed ? '견적서 관리' : undefined}
        />
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight">
            견적서 관리
          </span>
        )}
      </div>

      {/* 내비게이션 메뉴 */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          // 현재 경로와 일치하는 경우 활성 상태 적용
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors',
                collapsed ? 'justify-center' : 'gap-3',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              {/* 접힌 상태에서 aria-label로 접근성 처리 */}
              <Icon
                className="h-5 w-5 shrink-0"
                aria-label={collapsed ? item.label : undefined}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* 하단: 사이드바 접기/펼치기 토글 버튼 */}
      <div className="border-sidebar-border border-t p-2">
        <button
          onClick={onToggle}
          className={cn(
            'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors',
            collapsed ? 'justify-center' : 'gap-3'
          )}
          title={collapsed ? '메뉴 펼치기' : '메뉴 접기'}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 shrink-0" />
              <span>접기</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
