import { describe, it, expect } from 'vitest'
import { isUrl } from '../src/fns'

describe('isUrl', () => {
  it('should return true for valid http URL', () => {
    expect(isUrl('http://example.com')).toBe(true)
    expect(isUrl('http://sub.example.com')).toBe(true)
    expect(isUrl('http://example.com/path')).toBe(true)
    expect(isUrl('http://example.com/path?query=value')).toBe(true)
    expect(isUrl('http://example.com/path#fragment')).toBe(true)
  })

  it('should return true for valid https URL', () => {
    expect(isUrl('https://example.com')).toBe(true)
    expect(isUrl('https://sub.example.com')).toBe(true)
    expect(isUrl('https://example.com/path')).toBe(true)
    expect(isUrl('https://example.com/path?query=value')).toBe(true)
    expect(isUrl('https://example.com/path#fragment')).toBe(true)
  })

  it('should return true for URLs with mixed case', () => {
    expect(isUrl('HTTP://EXAMPLE.COM')).toBe(true)
    expect(isUrl('HttPs://ExAmPlE.cOm')).toBe(true)
  })

  it('should return true for URLs with special characters in path', () => {
    expect(isUrl('http://example.com/path-with-dash')).toBe(true)
    expect(isUrl('http://example.com/path_with_underscore')).toBe(true)
    expect(isUrl('http://example.com/path.with.dot')).toBe(true)
  })

  it('should return false for URLs without protocol', () => {
    expect(isUrl('example.com')).toBe(false)
    expect(isUrl('www.example.com')).toBe(false)
    expect(isUrl('/path/to/resource')).toBe(false)
  })

  it('should return false for URLs with invalid protocol', () => {
    expect(isUrl('invalid://example.com')).toBe(false)
    expect(isUrl('smtp://example.com')).toBe(false)
    expect(isUrl('file:///path/to/file')).toBe(false)
  })

  it('should return false for empty string', () => {
    expect(isUrl('')).toBe(false)
  })

  it('should return false for URLs with spaces', () => {
    expect(isUrl('http://example.com/path with space')).toBe(false)
    expect(isUrl('http://example.com path')).toBe(false)
  })

  it('should return false for only protocol part', () => {
    expect(isUrl('http://')).toBe(false)
    expect(isUrl('https://')).toBe(false)
    expect(isUrl('ftp://')).toBe(false)
  })

  it('should return false for malformed URLs', () => {
    expect(isUrl('http:/example.com')).toBe(false)
    expect(isUrl('http://')).toBe(false)
    expect(isUrl('http://.com')).toBe(false)
    expect(isUrl('http://example.')).toBe(false)
  })
})
