// 접근 제한 안내 페이지 (F005)
// 공개 여부가 false이거나 상태가 만료인 경우 클라이언트에게 안내 메시지를 표시

import Link from 'next/link'
import { Clock, LockKeyhole } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SUPPLIER_CONFIG } from '@/lib/config'

interface RestrictedPageProps {
  searchParams: Promise<{ reason?: string }>
}

export default async function RestrictedPage({
  searchParams,
}: RestrictedPageProps) {
  const { reason } = await searchParams

  // 만료 여부에 따라 아이콘 및 메시지 분기
  const isExpired = reason === 'expired'

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* 상태 아이콘: 만료 시 Clock, 비공개 시 LockKeyhole */}
        <div className="mb-6 flex justify-center">
          {isExpired ? (
            <Clock className="text-muted-foreground size-16" />
          ) : (
            <LockKeyhole className="text-muted-foreground size-16" />
          )}
        </div>

        {/* 제목 */}
        <h1 className="mb-3 text-xl font-bold">견적서에 접근할 수 없습니다</h1>

        {/* 사유 메시지 분기 */}
        <p className="text-muted-foreground mb-8 text-sm">
          {isExpired
            ? '해당 견적서의 유효기간이 만료되었습니다. 공급자에게 문의하여 새 견적서를 요청해 주세요.'
            : '해당 견적서는 비공개 처리되어 있습니다. 공급자에게 문의하여 접근 권한을 요청해 주세요.'}
        </p>

        {/* 공급자 문의 카드 */}
        <Card className="mb-6 text-left">
          <CardContent className="py-4">
            <p className="text-muted-foreground mb-2 text-xs font-medium">
              공급자 문의
            </p>
            <p className="font-semibold">{SUPPLIER_CONFIG.name}</p>
            {SUPPLIER_CONFIG.contactPerson && (
              <p className="text-muted-foreground mt-1 text-sm">
                담당자: {SUPPLIER_CONFIG.contactPerson}
              </p>
            )}
            {SUPPLIER_CONFIG.email && (
              <p className="text-muted-foreground mt-0.5 text-sm">
                이메일: {SUPPLIER_CONFIG.email}
              </p>
            )}
            {SUPPLIER_CONFIG.phone && (
              <p className="text-muted-foreground mt-0.5 text-sm">
                전화: {SUPPLIER_CONFIG.phone}
              </p>
            )}
          </CardContent>
        </Card>

        {/* 홈으로 돌아가기 버튼 */}
        <Button asChild variant="outline" className="w-full">
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </main>
  )
}
