// 애플리케이션 정적 설정
// 공급자 정보 등 환경 독립적인 설정값 관리

import type { SupplierInfo } from './types'

// 공급자(발행자) 정보 설정
// restricted 페이지 등 공급자 문의 정보 표시에 사용
export const SUPPLIER_CONFIG: SupplierInfo = {
  name: '(주)스튜디오 아이언',
  contactPerson: '김준혁',
  phone: '02-1234-5678',
  email: 'contact@studio-iron.kr',
  address: '서울특별시 강남구 테헤란로 123, 5층',
}
