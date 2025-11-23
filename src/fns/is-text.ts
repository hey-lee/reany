
export const isText = (buffer: Buffer): boolean => {
  if (buffer.length === 0) return true

  const sampleSize = Math.min(buffer.length, 8000)

  for (let i = 0; i < sampleSize; i++) {
    const byte = buffer[i]
    if (byte === 0) return false
    if (byte < 0x09) return false
    if (byte === 0x0b || byte === 0x0c) return false
    if (byte >= 0x0e && byte < 0x20) return false
  }

  return true
}
