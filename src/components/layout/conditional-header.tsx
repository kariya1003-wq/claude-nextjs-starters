'use client'

// 경로에 따라 공급자용 헤더를 조건부 렌더링하는 래퍼 컴포넌트
// /, /viewer/*, /restricted 경로에서는 헤더를 숨긴다

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/header'

// 헤더를 숨길 경로 접두사 목록
const HIDDEN_HEADER_PREFIXES = ['/viewer/', '/restricted']

export function ConditionalHeader() {
  const pathname = usePathname()
  // 루트 경로 또는 숨김 접두사로 시작하는 경우 헤더 숨김
  const shouldHide =
    pathname === '/' ||
    HIDDEN_HEADER_PREFIXES.some(prefix => pathname.startsWith(prefix))

  if (shouldHide) return null
  return <Header />
}
