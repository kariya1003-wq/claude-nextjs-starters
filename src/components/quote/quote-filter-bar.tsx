'use client'

// 견적서 목록 필터 바 컴포넌트
// URL 쿼리 파라미터(status, search)로 필터 상태를 관리하는 클라이언트 컴포넌트

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// 상태 필터 탭 정의
const STATUS_TABS = [
  { label: '전체', value: '' },
  { label: '초안', value: 'draft' },
  { label: '발송', value: 'sent' },
  { label: '확정', value: 'confirmed' },
  { label: '만료', value: 'expired' },
]

export function QuoteFilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 현재 URL에서 필터 값 읽기
  const currentStatus = searchParams.get('status') ?? ''
  const currentSearch = searchParams.get('search') ?? ''

  // 검색 입력 상태 (입력 중 로컬 상태 관리)
  const [searchInput, setSearchInput] = useState(currentSearch)

  // URL 쿼리가 바뀌면 로컬 입력 상태도 동기화
  useEffect(() => {
    setSearchInput(currentSearch)
  }, [currentSearch])

  // 쿼리 파라미터 업데이트 헬퍼 (히스토리 쌓지 않음)
  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      router.replace(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  // 상태 탭 클릭 핸들러
  const handleStatusChange = (value: string) => {
    updateParams({ status: value })
  }

  // 검색 엔터 또는 버튼 클릭 핸들러
  const handleSearch = () => {
    updateParams({ search: searchInput.trim() })
  }

  // 검색 입력창 엔터 키 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // 필터 전체 초기화 핸들러
  const handleReset = () => {
    setSearchInput('')
    router.replace(pathname)
  }

  // 필터가 적용된 상태인지 확인
  const isFiltered = currentStatus !== '' || currentSearch !== ''

  return (
    <div className="mb-4 space-y-3">
      {/* 상태 필터 탭 */}
      <div className="flex flex-wrap gap-1.5">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => handleStatusChange(tab.value)}
            className={cn(
              'rounded-full px-3 py-1 text-sm font-medium transition-colors',
              currentStatus === tab.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 검색 입력 영역 */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="견적번호 또는 클라이언트명 검색..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="max-w-sm"
        />
        <Button variant="secondary" size="sm" onClick={handleSearch}>
          검색
        </Button>

        {/* 필터 적용 중일 때만 초기화 버튼 표시 */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground"
          >
            <X className="mr-1 h-3.5 w-3.5" />
            초기화
          </Button>
        )}
      </div>
    </div>
  )
}
