// 개발/테스트용 더미 데이터
// 실제 Notion API 연동 전까지 사용하는 목업 데이터

import { type Quote, type SupplierInfo } from '@/lib/types'

// 공통 공급자 정보
export const MOCK_SUPPLIER: SupplierInfo = {
  name: '(주)스튜디오 아이언',
  contactPerson: '김준혁',
  phone: '02-1234-5678',
  email: 'contact@studio-iron.kr',
  address: '서울특별시 강남구 테헤란로 123, 5층',
}

// 견적서 더미 데이터 7건
// 상태 분포: draft 1건, sent 2건, confirmed 3건, expired 1건
// isPublic: true 5건, false 2건
export const MOCK_QUOTES: Quote[] = [
  {
    id: 'notion-page-id-001',
    quoteNumber: 'INV-2025-001',
    clientName: '(주)테크스타트',
    issueDate: '2025-03-01',
    expiryDate: '2025-03-31',
    items: [
      {
        name: '웹사이트 기획 및 디자인',
        quantity: 1,
        unitPrice: 2500000,
        amount: 2500000,
      },
      {
        name: '프론트엔드 개발',
        quantity: 1,
        unitPrice: 3500000,
        amount: 3500000,
      },
      {
        name: '백엔드 API 개발',
        quantity: 1,
        unitPrice: 2000000,
        amount: 2000000,
      },
    ],
    supplierInfo: MOCK_SUPPLIER,
    memo: '계약금 50% 선입금 후 작업 시작 예정입니다.',
    status: 'confirmed',
    isPublic: true,
    totalAmount: 8000000,
  },
  {
    id: 'notion-page-id-002',
    quoteNumber: 'INV-2025-002',
    clientName: '블루오션 마케팅',
    issueDate: '2025-03-05',
    expiryDate: '2025-04-05',
    items: [
      {
        name: '브랜드 아이덴티티 디자인',
        quantity: 1,
        unitPrice: 1800000,
        amount: 1800000,
      },
      {
        name: '명함 및 레터헤드 디자인',
        quantity: 2,
        unitPrice: 300000,
        amount: 600000,
      },
    ],
    supplierInfo: MOCK_SUPPLIER,
    status: 'sent',
    isPublic: true,
    totalAmount: 2400000,
  },
  {
    id: 'notion-page-id-003',
    quoteNumber: 'INV-2025-003',
    clientName: '그린솔루션즈',
    issueDate: '2025-02-15',
    expiryDate: '2025-03-15',
    items: [
      {
        name: '모바일 앱 UI/UX 디자인',
        quantity: 1,
        unitPrice: 4000000,
        amount: 4000000,
      },
      {
        name: '프로토타입 제작',
        quantity: 1,
        unitPrice: 800000,
        amount: 800000,
      },
      {
        name: '디자인 수정 (2회)',
        quantity: 2,
        unitPrice: 200000,
        amount: 400000,
      },
      {
        name: '디자인 가이드라인 문서',
        quantity: 1,
        unitPrice: 500000,
        amount: 500000,
      },
    ],
    supplierInfo: MOCK_SUPPLIER,
    memo: '초기 기획 미팅 후 디자인 방향성 확정 필요.',
    status: 'expired',
    isPublic: false,
    totalAmount: 5700000,
  },
  {
    id: 'notion-page-id-004',
    quoteNumber: 'INV-2025-004',
    clientName: '서울 이노베이션 센터',
    issueDate: '2025-03-10',
    expiryDate: '2025-04-10',
    items: [
      {
        name: '반응형 랜딩페이지 개발',
        quantity: 1,
        unitPrice: 3000000,
        amount: 3000000,
      },
      {
        name: 'SEO 최적화 작업',
        quantity: 1,
        unitPrice: 700000,
        amount: 700000,
      },
    ],
    supplierInfo: MOCK_SUPPLIER,
    status: 'confirmed',
    isPublic: true,
    totalAmount: 3700000,
  },
  {
    id: 'notion-page-id-005',
    quoteNumber: 'INV-2025-005',
    clientName: '퓨처커머스',
    issueDate: '2025-03-12',
    expiryDate: '2025-04-12',
    items: [
      {
        name: '이커머스 플랫폼 개발',
        quantity: 1,
        unitPrice: 8000000,
        amount: 8000000,
      },
      {
        name: '관리자 대시보드',
        quantity: 1,
        unitPrice: 2500000,
        amount: 2500000,
      },
      {
        name: '결제 모듈 연동',
        quantity: 1,
        unitPrice: 1200000,
        amount: 1200000,
      },
    ],
    supplierInfo: MOCK_SUPPLIER,
    memo: 'PG사 계약은 클라이언트 직접 진행. 연동 작업만 포함.',
    status: 'draft',
    isPublic: false,
    totalAmount: 11700000,
  },
  {
    id: 'notion-page-id-006',
    quoteNumber: 'INV-2025-006',
    clientName: '미래교육재단',
    issueDate: '2025-03-18',
    expiryDate: '2025-04-18',
    items: [
      {
        name: '교육 플랫폼 웹사이트 개발',
        quantity: 1,
        unitPrice: 5500000,
        amount: 5500000,
      },
      {
        name: '영상 강의 업로드 시스템',
        quantity: 1,
        unitPrice: 1500000,
        amount: 1500000,
      },
    ],
    supplierInfo: MOCK_SUPPLIER,
    status: 'sent',
    isPublic: true,
    totalAmount: 7000000,
  },
  {
    id: 'notion-page-id-007',
    quoteNumber: 'INV-2025-007',
    clientName: '더블유컨설팅',
    issueDate: '2025-03-20',
    expiryDate: '2025-04-20',
    items: [
      {
        name: '기업 홈페이지 리뉴얼',
        quantity: 1,
        unitPrice: 4200000,
        amount: 4200000,
      },
      {
        name: '콘텐츠 마이그레이션',
        quantity: 1,
        unitPrice: 600000,
        amount: 600000,
      },
      {
        name: '유지보수 (3개월)',
        quantity: 3,
        unitPrice: 200000,
        amount: 600000,
      },
    ],
    supplierInfo: MOCK_SUPPLIER,
    memo: '기존 홈페이지 콘텐츠 이전 포함. 도메인 이전은 별도 비용.',
    status: 'confirmed',
    isPublic: true,
    totalAmount: 5400000,
  },
]
