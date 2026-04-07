'use server'

// 로그인 Server Action
// ADMIN_PASSWORD 환경 변수와 비교 후 세션 쿠키 설정

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { signToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/auth'

// 개발 환경 기본값 (환경 변수 미설정 시 사용)
const DEV_SESSION_SECRET = 'dev-secret-please-change-in-production'

export async function loginAction(
  formData: FormData
): Promise<{ error?: string }> {
  const password = formData.get('password')?.toString() ?? ''

  // ADMIN_PASSWORD 환경 변수 확인
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    if (process.env.NODE_ENV === 'production') {
      // 프로덕션에서 ADMIN_PASSWORD 미설정 시 로그인 차단
      console.error('[Auth] ADMIN_PASSWORD 환경 변수가 설정되지 않았습니다.')
      return { error: '서버 설정 오류가 발생했습니다. 관리자에게 문의하세요.' }
    }
    // 개발 환경: 경고 로그 출력 후 비밀번호 없이 허용 (빈 문자열도 통과)
    console.warn(
      '[Auth] ADMIN_PASSWORD 미설정 - 개발 환경에서는 임의 비밀번호를 허용합니다.'
    )
  } else {
    // 비밀번호 일치 여부 확인
    if (password !== adminPassword) {
      return { error: '비밀번호가 올바르지 않습니다.' }
    }
  }

  // 세션 토큰 생성
  const sessionSecret = process.env.SESSION_SECRET ?? DEV_SESSION_SECRET
  const token = await signToken(sessionSecret)

  // HttpOnly 쿠키에 세션 토큰 저장
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })

  // from 파라미터가 있으면 해당 경로로, 없으면 루트로 리다이렉트
  // redirect()는 try/catch 밖에서 호출 (Next.js 내부적으로 throw 처리)
  const from = formData.get('from')?.toString()
  redirect(from && from.startsWith('/') ? from : '/')
}

export async function logoutAction(): Promise<void> {
  // 세션 쿠키 삭제
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)

  redirect('/login')
}
