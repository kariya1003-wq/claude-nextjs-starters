import { z } from 'zod'

// 견적서 상태 정의
// draft: 초안, sent: 발송, confirmed: 확정, expired: 만료
export const quoteStatusSchema = z.enum([
  'draft',
  'sent',
  'confirmed',
  'expired',
])
export type QuoteStatus = z.infer<typeof quoteStatusSchema>

// 견적서 품목 스키마
export const quoteItemSchema = z.object({
  /** 품목명 */
  name: z.string(),
  /** 수량 */
  quantity: z.number(),
  /** 단가 (원) */
  unitPrice: z.number(),
  /** 합계 (수량 × 단가) */
  amount: z.number(),
})
export type QuoteItem = z.infer<typeof quoteItemSchema>

// 공급자 정보 스키마
export const supplierInfoSchema = z.object({
  /** 회사명 또는 공급자 이름 */
  name: z.string(),
  /** 담당자명 */
  contactPerson: z.string().optional(),
  /** 연락처 */
  phone: z.string().optional(),
  /** 이메일 */
  email: z.string().email().optional(),
  /** 주소 */
  address: z.string().optional(),
})
export type SupplierInfo = z.infer<typeof supplierInfoSchema>

// 견적서 스키마 (Notion DB 필드 기반)
export const quoteSchema = z.object({
  /** Notion 페이지 ID */
  id: z.string(),
  /** 견적번호 (예: Q-2024-001) */
  quoteNumber: z.string(),
  /** 클라이언트명 */
  clientName: z.string(),
  /** 발행일 (ISO 8601 날짜 문자열) */
  issueDate: z.string(),
  /** 유효 만료일 (ISO 8601 날짜 문자열) */
  expiryDate: z.string(),
  /** 견적 품목 목록 */
  items: z.array(quoteItemSchema),
  /** 공급자 정보 */
  supplierInfo: supplierInfoSchema,
  /** 메모 또는 추가 안내사항 */
  memo: z.string().optional(),
  /** 견적서 상태 */
  status: quoteStatusSchema,
  /** 클라이언트 공개 여부 */
  isPublic: z.boolean(),
  /** 총액 (원) */
  totalAmount: z.number(),
})
export type Quote = z.infer<typeof quoteSchema>
