import { describe, expect, it } from 'vitest'
import { sanitizeHtml } from './sanitize-html'

describe('sanitizeHtml', () => {
  it('removes script tags while keeping safe markup', () => {
    const dirty = "<p>Hello <strong>world</strong></p><script>alert('xss')</script>"
    const clean = sanitizeHtml(dirty)

    expect(clean).toContain('<p>')
    expect(clean).toContain('<strong>world</strong>')
    expect(clean).not.toContain('<script>')
  })

  it('returns empty string for falsy input', () => {
    expect(sanitizeHtml('')).toBe('')
    expect(sanitizeHtml(null)).toBe('')
    expect(sanitizeHtml(undefined)).toBe('')
  })
})
