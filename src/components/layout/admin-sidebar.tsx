'use client'

// 관리자 대시보드 사이드바 컴포넌트
// 데스크톱 고정 사이드바, collapsed 상태에 따라 아이콘만/아이콘+텍스트 표시

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutList,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  const { theme, setTheme } = useTheme()

  // 현재 테마에 맞는 아이콘 반환
  function ThemeIcon() {
    if (theme === 'light') return <Sun className="h-5 w-5 shrink-0" />
    if (theme === 'dark') return <Moon className="h-5 w-5 shrink-0" />
    return <Monitor className="h-5 w-5 shrink-0" />
  }

  // 테마 순환 전환: light → dark → system → light
  const cycleTheme = () => {
    const order = ['light', 'dark', 'system']
    const next = order[(order.indexOf(theme ?? 'system') + 1) % 3]
    setTheme(next)
  }

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

      {/* 하단: 테마 토글 + 접기 버튼 */}
      <div className="border-sidebar-border space-y-1 border-t p-2">
        {/* 테마 토글 버튼 */}
        {collapsed ? (
          // 접힌 상태: 단순 버튼으로 light → dark → system 순환
          <button
            onClick={cycleTheme}
            className={cn(
              'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center justify-center rounded-md px-2 py-2 text-sm transition-colors'
            )}
            title={`현재 테마: ${theme ?? 'system'} (클릭하여 전환)`}
          >
            <ThemeIcon />
          </button>
        ) : (
          // 펼친 상태: 드롭다운 메뉴로 테마 선택
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors'
                )}
              >
                <ThemeIcon />
                <span>테마</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                라이트
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                다크
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className="mr-2 h-4 w-4" />
                시스템
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* 접기/펼치기 토글 버튼 */}
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
