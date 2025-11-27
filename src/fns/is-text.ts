
/**
 * Determines whether the given buffer contains only text data.
 * A buffer is considered text if it contains no null bytes and no
 * control characters outside the printable ASCII range (0x09, 0x0A, 0x0D).
 *
 * @param buffer - The buffer to inspect.
 * @returns `true` if the buffer is text, `false` otherwise.
 *
 * @example
 * ```ts
 * import { isText } from './utils';
 *
 * const textBuffer = Buffer.from('Hello, world!');
 * console.log(isText(textBuffer)); // true
 *
 * const binaryBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47]);
 * console.log(isText(binaryBuffer)); // false
 * ```
 */
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
