import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { cache } from 'react'
import { env } from './env'
import {
  quoteSchema,
  quoteItemSchema,
  type Quote,
  type QuoteItem,
  type QuoteStatus,
} from './types'

// Notion 클라이언트 인스턴스 생성
// NOTION_API_KEY가 없을 경우 빈 문자열로 초기화 (guard용)
const notion = new Client({
  auth: env.NOTION_API_KEY ?? '',
})

// Notion API 사용 가능 여부 확인 (API 키 및 DB ID 존재 여부)
function isNotionConfigured(): boolean {
  return Boolean(env.NOTION_API_KEY && env.NOTION_DATABASE_ID)
}

// Notion Select 상태값 → 내부 QuoteStatus enum 매핑
// 대기→draft, 발송→sent, 확정→confirmed, 만료→expired
function mapStatusToEnum(status: string | null | undefined): QuoteStatus {
  const statusMap: Record<string, QuoteStatus> = {
    대기: 'draft',
    발송: 'sent',
    확정: 'confirmed',
    승인: 'confirmed',
    거절: 'expired',
    만료: 'expired',
  }
  return statusMap[status ?? ''] ?? 'draft'
}

// Rich Text 배열에서 평문 텍스트 추출 헬퍼
function extractRichText(
  richText: Array<{ plain_text: string }> | undefined
): string {
  return richText?.map(t => t.plain_text).join('') ?? ''
}

// PageObjectResponse properties에서 값 추출 (타입 안전)
type PageProps = PageObjectResponse['properties']
type PropValue = PageProps[string]

function getProp(properties: PageProps, key: string): PropValue | undefined {
  return properties[key]
}

// Items DB의 각 품목 페이지를 QuoteItem으로 변환
function mapNotionPageToQuoteItem(page: PageObjectResponse): QuoteItem | null {
  try {
    const props = page.properties

    // 항목명 (title 타입)
    const nameProp = getProp(props, '항목명')
    const name =
      nameProp?.type === 'title' ? extractRichText(nameProp.title) : ''

    // 수량 (number 타입)
    const quantityProp = getProp(props, '수량')
    const quantity =
      quantityProp?.type === 'number' ? (quantityProp.number ?? 0) : 0

    // 단가 (number 타입)
    const unitPriceProp = getProp(props, '단가')
    const unitPrice =
      unitPriceProp?.type === 'number' ? (unitPriceProp.number ?? 0) : 0

    // 금액 (formula 또는 number 타입)
    const amountProp = getProp(props, '금액')
    let amount = 0
    if (amountProp?.type === 'number') {
      amount = amountProp.number ?? 0
    } else if (amountProp?.type === 'formula') {
      const formulaResult = amountProp.formula
      if (formulaResult?.type === 'number') {
        amount = formulaResult.number ?? 0
      }
    }
    // formula 값이 없을 경우 수량 × 단가로 계산
    if (amount === 0 && quantity > 0 && unitPrice > 0) {
      amount = quantity * unitPrice
    }

    return quoteItemSchema.parse({ name, quantity, unitPrice, amount })
  } catch (error) {
    // 유효성 검사 실패 시 null 반환
    console.error('품목 데이터 파싱 오류:', error)
    return null
  }
}

// Notion 견적서 페이지 + 품목 데이터를 Quote 타입으로 변환
// items는 fetchQuoteItems로 별도 조회한 결과를 전달받음
function mapNotionPageToQuote(
  page: PageObjectResponse,
  items: QuoteItem[]
): Quote | null {
  try {
    const props = page.properties

    // 견적서 번호 (title 타입)
    const quoteNumberProp = getProp(props, '견적서 번호')
    const quoteNumber =
      quoteNumberProp?.type === 'title'
        ? extractRichText(quoteNumberProp.title)
        : ''

    // 클라이언트명 (rich_text 타입)
    const clientNameProp = getProp(props, '클라이언트명')
    const clientName =
      clientNameProp?.type === 'rich_text'
        ? extractRichText(clientNameProp.rich_text)
        : ''

    // 발행일 (date 타입)
    const issueDateProp = getProp(props, '발행일')
    const issueDate =
      issueDateProp?.type === 'date' ? (issueDateProp.date?.start ?? '') : ''

    // 유효기간 (date 타입)
    const expiryDateProp = getProp(props, '유효기간')
    const expiryDate =
      expiryDateProp?.type === 'date' ? (expiryDateProp.date?.start ?? '') : ''

    // 상태 (status 타입) → 내부 enum으로 변환
    // Notion의 Status 속성은 type='status'이며 select와 다름
    const statusProp = getProp(props, '상태')
    const statusValue =
      statusProp?.type === 'status'
        ? (statusProp as { type: 'status'; status: { name: string } | null })
            .status?.name
        : undefined
    const status = mapStatusToEnum(statusValue)

    // 총금액 (number 타입)
    const totalAmountProp = getProp(props, '총금액')
    const totalAmount =
      totalAmountProp?.type === 'number' ? (totalAmountProp.number ?? 0) : 0

    // 발행자 (rich_text 타입) → supplierInfo.name으로 사용
    const issuerProp = getProp(props, '발행자')
    const issuerName =
      issuerProp?.type === 'rich_text'
        ? extractRichText(issuerProp.rich_text)
        : ''

    // 비고 (rich_text 타입)
    const memoProp = getProp(props, '비고')
    const memo =
      memoProp?.type === 'rich_text'
        ? extractRichText(memoProp.rich_text)
        : undefined

    return quoteSchema.parse({
      id: page.id,
      quoteNumber,
      clientName,
      issueDate,
      expiryDate,
      items,
      supplierInfo: {
        // 발행자 필드를 공급자명으로 매핑
        name: issuerName || '미지정',
      },
      memo: memo || undefined,
      status,
      // Notion DB에 공개 여부 필드 없음 → sent/confirmed 상태면 공개 처리
      isPublic: status === 'sent' || status === 'confirmed',
      totalAmount,
    })
  } catch (error) {
    // 유효성 검사 실패 시 null 반환
    console.error('견적서 데이터 파싱 오류:', error)
    return null
  }
}

// 견적서 페이지의 항목(Relation) ID 배열 추출
function extractItemIds(page: PageObjectResponse): string[] {
  const itemsProp = page.properties['항목']
  if (itemsProp?.type === 'relation') {
    return itemsProp.relation.map(r => r.id)
  }
  return []
}

// Items DB에서 품목 ID 목록으로 QuoteItem 배열 조회
export async function fetchQuoteItems(itemIds: string[]): Promise<QuoteItem[]> {
  // Notion 미설정 시 빈 배열 반환
  if (!isNotionConfigured() || itemIds.length === 0) return []

  try {
    // 각 아이템 ID로 페이지 조회 후 병렬 처리
    const pageResults = await Promise.all(
      itemIds.map(id =>
        notion.pages.retrieve({ page_id: id }).catch(err => {
          console.error(`품목 페이지 조회 실패 (id: ${id}):`, err)
          return null
        })
      )
    )

    // null 제거 및 PageObjectResponse 필터링 후 QuoteItem으로 변환
    return pageResults
      .filter(
        (page): page is PageObjectResponse =>
          page !== null && 'properties' in page && page.object === 'page'
      )
      .map(mapNotionPageToQuoteItem)
      .filter((item): item is QuoteItem => item !== null)
  } catch (error) {
    console.error('품목 목록 조회 오류:', error)
    return []
  }
}

// Notion REST API 직접 호출 헬퍼 (databases.query 엔드포인트)
// revalidate: undefined → no-store(실시간), 숫자 → ISR(초 단위)
async function queryDatabase(
  databaseId: string,
  body: Record<string, unknown> = {},
  revalidate?: number
): Promise<{ results: PageObjectResponse[] }> {
  const cacheOption: RequestInit =
    revalidate !== undefined ? { next: { revalidate } } : { cache: 'no-store' }

  const res = await fetch(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      ...cacheOption,
    }
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message ?? 'Notion API 오류')
  }
  const data = await res.json()
  return {
    results: (data.results ?? []).filter(
      (p: PageObjectResponse) => 'properties' in p && p.object === 'page'
    ),
  }
}

// Invoices DB 전체 견적서 목록 조회
export async function fetchQuotes(): Promise<Quote[]> {
  // Notion 미설정 시 빈 배열 반환 (빌드/런타임 오류 방지)
  if (!isNotionConfigured()) return []

  try {
    // 목록은 30초 ISR 캐싱 적용 (약간의 지연 허용)
    const response = await queryDatabase(env.NOTION_DATABASE_ID!, {}, 30)

    // 각 페이지를 Quote로 변환 (품목 별도 조회 포함)
    const quotes = await Promise.all(
      response.results.map(async page => {
        const itemIds = extractItemIds(page)
        const items = await fetchQuoteItems(itemIds)
        return mapNotionPageToQuote(page, items)
      })
    )

    // null 제거 후 반환
    return quotes.filter((q): q is Quote => q !== null)
  } catch (error) {
    console.error('견적서 목록 조회 오류:', error)
    return []
  }
}

// 견적서 번호(Title 필드)로 단일 견적서 조회
// React cache()로 래핑: 동일 요청 내 generateMetadata + page 컴포넌트 모두 호출 시 1회만 API 호출
export const fetchQuoteByNumber = cache(async function fetchQuoteByNumber(
  quoteNumber: string
): Promise<Quote | null> {
  // Notion 미설정 시 null 반환
  if (!isNotionConfigured()) return null

  try {
    // Title 필드(견적서 번호)로 필터링
    const response = await queryDatabase(env.NOTION_DATABASE_ID!, {
      filter: {
        property: '견적서 번호',
        title: {
          equals: quoteNumber,
        },
      },
    })

    // PageObjectResponse만 필터링
    const pages = response.results.filter(
      (page): page is PageObjectResponse =>
        'properties' in page && page.object === 'page'
    )

    // 결과 없으면 null 반환
    if (pages.length === 0) return null

    const page = pages[0]
    const itemIds = extractItemIds(page)
    const items = await fetchQuoteItems(itemIds)
    return mapNotionPageToQuote(page, items)
  } catch (error) {
    console.error(`견적서 조회 오류 (번호: ${quoteNumber}):`, error)
    return null
  }
})
