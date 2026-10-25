import { AUTH_PREVIEW_NOTICE } from '@/lib/persistence'

export function AuthPreviewNotice() {
  return (
    <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
      {AUTH_PREVIEW_NOTICE}
    </p>
  )
}
