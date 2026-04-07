// 관리자 로그인 페이지 (Server Component)
// 이미 인증된 경우 / 로 리다이렉트, 미인증 시 LoginForm 렌더링

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import { verifyToken, SESSION_COOKIE_NAME } from '@/lib/auth'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: '관리자 로그인 | 견적서 관리',
  description: '관리자 로그인 페이지',
}

// Next.js 15: searchParams는 Promise 타입
interface LoginPageProps {
  searchParams: Promise<{ from?: string }>
}

const DEV_SESSION_SECRET = 'dev-secret-please-change-in-production'

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { from } = await searchParams

  // 이미 로그인된 경우 / 로 리다이렉트
  const sessionSecret = process.env.SESSION_SECRET ?? DEV_SESSION_SECRET
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (sessionToken && (await verifyToken(sessionToken, sessionSecret))) {
    redirect('/')
  }

  return (
    // 화면 중앙 카드 레이아웃, 다크모드 자동 지원 (ThemeProvider 하위)
    <main className="flex min-h-screen items-center justify-center p-4">
      <LoginForm from={from} />
    </main>
  )
}
