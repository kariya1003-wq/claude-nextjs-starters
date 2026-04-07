// 관리자 인증 미들웨어
// 보호 경로 접근 시 쿠키 토큰 검증, 미인증 시 /login으로 리다이렉트

import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME, verifyToken } from '@/lib/auth'

// 개발 환경 기본 SESSION_SECRET (프로덕션에서는 반드시 환경 변수 설정 필요)
const DEV_SESSION_SECRET = 'dev-secret-please-change-in-production'

// 보호 경로 패턴 (인증 필요)
// - / (루트)
// - /quotes/*
// - /api/pdf/*
function isProtectedPath(pathname: string): boolean {
  if (pathname === '/') return true
  if (pathname.startsWith('/quotes')) return true
  if (pathname.startsWith('/api/pdf')) return true
  return false
}

// 공개 경로 패턴 (인증 불필요)
// - /login
// - /viewer/*
// - /restricted
// - /api/* (pdf 제외)
function isPublicPath(pathname: string): boolean {
  if (pathname === '/login') return true
  if (pathname.startsWith('/viewer')) return true
  if (pathname === '/restricted') return true
  if (pathname.startsWith('/api') && !pathname.startsWith('/api/pdf'))
    return true
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // SESSION_SECRET 환경 변수 (미설정 시 개발용 기본값 사용)
  const sessionSecret = process.env.SESSION_SECRET ?? DEV_SESSION_SECRET

  if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
    console.warn(
      '[Auth] SESSION_SECRET 환경 변수가 설정되지 않았습니다. 프로덕션에서는 필수입니다.'
    )
  }

  // 쿠키에서 세션 토큰 읽기
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const isAuthenticated = sessionToken
    ? await verifyToken(sessionToken, sessionSecret)
    : false

  // /login 경로: 이미 인증된 경우 / 로 리다이렉트
  if (pathname === '/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // 공개 경로: 인증 없이 통과
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // 보호 경로: 미인증 시 /login?from={현재경로} 로 리다이렉트
  if (isProtectedPath(pathname)) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // 기타 경로: 그대로 통과
  return NextResponse.next()
}

export const config = {
  // _next/static, _next/image, favicon.ico 제외한 모든 경로에 미들웨어 적용
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
