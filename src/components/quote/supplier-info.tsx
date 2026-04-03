// 공급자 정보 컴포넌트 (RSC)
// dl/dt/dd 시맨틱 태그를 사용하여 공급자 정보를 표시

import { type SupplierInfo } from '@/lib/types'

interface SupplierInfoProps {
  supplierInfo: SupplierInfo
}

export function SupplierInfoCard({ supplierInfo }: SupplierInfoProps) {
  return (
    <div>
      <h2 className="mb-3 text-base font-semibold">{supplierInfo.name}</h2>
      {/* 모바일: 1열, 데스크톱: 2열 그리드 */}
      <dl className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
        {/* 담당자: 값이 있을 때만 렌더링 */}
        {supplierInfo.contactPerson && (
          <div className="flex gap-2">
            <dt className="text-muted-foreground min-w-[4rem]">담당자</dt>
            <dd>{supplierInfo.contactPerson}</dd>
          </div>
        )}
        {/* 연락처: 값이 있을 때만 렌더링 */}
        {supplierInfo.phone && (
          <div className="flex gap-2">
            <dt className="text-muted-foreground min-w-[4rem]">연락처</dt>
            <dd>{supplierInfo.phone}</dd>
          </div>
        )}
        {/* 이메일: 값이 있을 때만 렌더링 */}
        {supplierInfo.email && (
          <div className="flex gap-2">
            <dt className="text-muted-foreground min-w-[4rem]">이메일</dt>
            <dd>{supplierInfo.email}</dd>
          </div>
        )}
        {/* 주소: 값이 있을 때만 렌더링 */}
        {supplierInfo.address && (
          <div className="flex gap-2 md:col-span-2">
            <dt className="text-muted-foreground min-w-[4rem]">주소</dt>
            <dd>{supplierInfo.address}</dd>
          </div>
        )}
      </dl>
    </div>
  )
}
