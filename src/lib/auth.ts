// 관리자 인증 유틸리티
// Web Crypto API (Node.js 내장)를 사용한 HMAC-SHA256 서명 토큰 기반 인증

export const SESSION_COOKIE_NAME = 'admin_session'

// 세션 유효기간: 24시간 (초 단위)
export const SESSION_MAX_AGE = 60 * 60 * 24

/**
 * HMAC-SHA256 서명 토큰 생성
 * 토큰 형식: `${timestamp}.${hmacHex}`
 * - timestamp: Unix seconds (만료 체크용)
 * - hmacHex: SHA-256(timestamp + ":" + secret)
 */
export async function signToken(secret: string): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000)
  const message = `${timestamp}:${secret}`

  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const msgData = encoder.encode(message)

  // HMAC 키 가져오기
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  // HMAC-SHA256 서명 생성
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData)

  // ArrayBuffer → hex 문자열 변환
  const hmacHex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  return `${timestamp}.${hmacHex}`
}

/**
 * 토큰 유효성 및 만료 검사
 * - 토큰 형식 확인
 * - 서명 일치 여부 확인 (타이밍 공격 방지를 위해 constant-time 비교)
 * - 만료 시간 (SESSION_MAX_AGE) 초과 여부 확인
 */
export async function verifyToken(
  token: string,
  secret: string
): Promise<boolean> {
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return false

    const [timestampStr, providedHmac] = parts
    const timestamp = parseInt(timestampStr, 10)

    // 타임스탬프 유효성 확인
    if (isNaN(timestamp)) return false

    // 만료 시간 확인
    const now = Math.floor(Date.now() / 1000)
    if (now - timestamp > SESSION_MAX_AGE) return false

    // 서명 재생성 후 비교
    const message = `${timestamp}:${secret}`
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const msgData = encoder.encode(message)

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData)
    const expectedHmac = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // constant-time 비교 (타이밍 공격 방지)
    if (providedHmac.length !== expectedHmac.length) return false

    let mismatch = 0
    for (let i = 0; i < providedHmac.length; i++) {
      mismatch |= providedHmac.charCodeAt(i) ^ expectedHmac.charCodeAt(i)
    }

    return mismatch === 0
  } catch {
    return false
  }
}
