'use client'

// 관리자 로그인 폼 컴포넌트
// React Hook Form + Zod 유효성 검사, shadcn/ui 컴포넌트 활용

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, FileText } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginAction } from '@/app/login/actions'

// Zod 유효성 검사 스키마
const loginSchema = z.object({
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  // 로그인 성공 후 리다이렉트할 경로 (from 쿼리 파라미터)
  from?: string
}

export function LoginForm({ from }: LoginFormProps) {
  // 비밀번호 표시/숨김 상태
  const [showPassword, setShowPassword] = useState(false)
  // Server Action 에러 메시지
  const [serverError, setServerError] = useState<string | null>(null)
  // 제출 중 로딩 상태 (useTransition으로 pending 관리)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  // 폼 제출 처리
  const onSubmit = (values: LoginFormValues) => {
    setServerError(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.append('password', values.password)

      // from 경로가 있으면 FormData에 포함 (Server Action에서 리다이렉트 경로로 사용)
      if (from) {
        formData.append('from', from)
      }

      const result = await loginAction(formData)

      // error가 반환된 경우만 처리 (성공 시 redirect로 인해 여기 도달 안 함)
      if (result?.error) {
        setServerError(result.error)
      }
    })
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1 text-center">
        {/* 로고 + 서비스명 */}
        <div className="mb-2 flex items-center justify-center gap-2">
          <FileText className="text-primary h-6 w-6" />
          <span className="text-lg font-semibold tracking-tight">
            견적서 관리
          </span>
        </div>
        <CardTitle className="text-2xl font-bold">관리자 로그인</CardTitle>
        <CardDescription>비밀번호를 입력하여 로그인하세요.</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* 비밀번호 필드 */}
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
                disabled={isPending}
                className="pr-10"
                {...register('password')}
              />
              {/* 비밀번호 표시/숨김 토글 버튼 */}
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {/* Zod 유효성 검사 에러 */}
            {errors.password && (
              <p className="text-destructive text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Server Action 에러 메시지 */}
          {serverError && (
            <p className="text-destructive bg-destructive/10 rounded-md px-3 py-2 text-sm">
              {serverError}
            </p>
          )}

          {/* 로그인 버튼 */}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
