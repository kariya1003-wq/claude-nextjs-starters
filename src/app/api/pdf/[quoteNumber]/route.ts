// PDF 생성 Route Handler (F004)
// puppeteer로 뷰어 페이지를 렌더링하여 A4 PDF를 생성 후 반환
// 로컬: puppeteer (Chromium 번들 포함)
// Vercel: puppeteer-core + @sparticuz/chromium-min (서버리스 환경 대응)

import { fetchQuoteByNumber } from '@/lib/notion'
import { env } from '@/lib/env'
import type { Browser } from 'puppeteer-core'

// 환경에 따라 브라우저 인스턴스를 다르게 생성하는 헬퍼
async function getBrowser(): Promise<Browser> {
  if (env.VERCEL_URL) {
    // Vercel 서버리스 환경: @sparticuz/chromium-min 사용 (Chromium 번들 미포함)
    // Chromium 클래스는 default export
    const { default: Chromium } = await import('@sparticuz/chromium-min')
    const puppeteerCore = await import('puppeteer-core')
    return puppeteerCore.launch({
      args: Chromium.args,
      defaultViewport: null,
      executablePath: await Chromium.executablePath(
        'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar'
      ),
      headless: true,
    }) as unknown as Browser
  }

  // 로컬 개발 환경: 일반 puppeteer (Chromium 번들 포함)
  const puppeteer = await import('puppeteer')
  return puppeteer.launch({ headless: true }) as unknown as Browser
}

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

  let browser: Browser | null = null
  try {
    // 환경에 맞는 브라우저 실행 및 뷰어 페이지 렌더링
    browser = await getBrowser()
    const page = await browser.newPage()

    // A4 용지 폭에 맞게 뷰포트 설정 (96dpi 기준 210mm = 794px)
    // 뷰포트가 A4 폭보다 넓으면 콘텐츠가 인쇄 가능 영역을 초과함
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 })

    await page.goto(`${appUrl}/viewer/${quoteNumber}`, {
      waitUntil: 'networkidle0',
    })

    // A4 크기 PDF 생성 (배경색 포함, 인쇄 마진 적용)
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
    })

    return new Response(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="quote-${quoteNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF 생성 오류:', error)
    return new Response('Internal Server Error', { status: 500 })
  } finally {
    // 브라우저 리소스 정리 (에러 발생 시에도 반드시 닫음)
    await browser?.close()
  }
}
