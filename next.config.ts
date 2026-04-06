import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  // puppeteer 관련 패키지를 서버 사이드 외부 패키지로 처리 (번들링 제외)
  // 로컬: puppeteer, Vercel: puppeteer-core + @sparticuz/chromium-min
  serverExternalPackages: [
    'puppeteer',
    'puppeteer-core',
    '@sparticuz/chromium-min',
  ],
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

export default nextConfig
