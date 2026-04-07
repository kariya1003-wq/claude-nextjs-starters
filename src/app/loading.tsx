// 견적서 목록 페이지 로딩 상태
// Next.js App Router loading.tsx - 데이터 로딩 중 표시되는 전체 화면 스피너

export default function Loading() {
  return (
    // 전체 화면 가운데 로딩 스피너
    <div className="flex h-screen items-center justify-center">
      <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
  )
}
