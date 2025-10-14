import DOMPurify from 'dompurify'

export function sanitizeHtml(content: string | null | undefined): string {
  if (!content) {
    return ''
  }

  if (typeof window === 'undefined') {
    return content
  }

  return DOMPurify.sanitize(content, {
    USE_PROFILES: { html: true },
  })
}
