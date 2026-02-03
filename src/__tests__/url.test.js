import { describe, it, expect } from 'vitest'
import { isHttpsUrl } from '../utils/url.js'

describe('isHttpsUrl', () => {
  it('should return true for HTTPS URLs', () => {
    expect(isHttpsUrl('https://example.com')).toBe(true)
    expect(isHttpsUrl('https://stream.rcs.revma.com/aw9uqyxy2tzuv')).toBe(true)
  })

  it('should return false for HTTP URLs', () => {
    expect(isHttpsUrl('http://example.com')).toBe(false)
    expect(isHttpsUrl('http://125.227.87.206:8000/FM98.5')).toBe(false)
  })

  it('should return false for other protocols', () => {
    expect(isHttpsUrl('ftp://example.com')).toBe(false)
    expect(isHttpsUrl('file:///path/to/file')).toBe(false)
  })
})
