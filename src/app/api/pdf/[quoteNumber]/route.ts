// PDF 생성 Route Handler (F004)
// puppeteer로 뷰어 페이지를 렌더링하여 A4 PDF를 생성 후 반환

import puppeteer from 'puppeteer'
import { fetchQuoteByNumber } from '@/lib/notion'
import { env } from '@/lib/env'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ quoteNumber: string }> }
) {
  const { quoteNumber } = await params

  // 견적서 조회
  const quote = await fetchQuoteByNumber(quoteNumber)
  if (!quote) {
    return new Response('Not Found', { status: 404 })
  }

  // 접근 가능 여부 확인 (sent 또는 confirmed이고 isPublic인 경우만 허용)
  const canAccess =
    (quote.status === 'sent' || quote.status === 'confirmed') && quote.isPublic
  if (!canAccess) {
    return new Response('Forbidden', { status: 403 })
  }

  // 앱 기본 URL 결정 (환경변수 우선, Vercel URL, 로컬 폴백)
  const appUrl =
    env.NEXT_PUBLIC_APP_URL ??
    (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : 'http://localhost:3000')

  try {
    // puppeteer로 브라우저 실행 및 뷰어 페이지 렌더링
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    await page.goto(`${appUrl}/viewer/${quoteNumber}`, {
      waitUntil: 'networkidle0',
    })

    // A4 크기 PDF 생성 (배경색 포함)
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
    })

    await browser.close()

    return new Response(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="quote-${quoteNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF 생성 오류:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
