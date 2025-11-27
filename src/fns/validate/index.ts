
import type { Rule } from './rules'

/**
 * Validate a text string against an array of rules.
 *
 * @param text   - The text to validate.
 * @param rules  - An array of validation rules to apply.
 * @returns      - A tuple: `[true]` if all rules pass,
 *                 or `[false, message]` where `message` is the first failure message.
 *
 * @example
 * ```ts
 * const rules = [
 *   {
 *     validate: (t: string) => t.length >= 5,
 *     message: 'Text must be at least 5 characters'
 *   }
 * ];
 * const [ok, msg] = await validate('hi', rules);
 * console.log(ok);  // false
 * console.log(msg); // "Text must be at least 5 characters"
 * ```
 */

export const validate = async (text: string, rules: Rule[]) => {
  for (const rule of rules) {
    const isValid = await rule.validate(text)
    if (!isValid) {
      const message = typeof rule.message === 'function' ? rule.message(text) : rule.message
      return [false, message]
    }
  }
  return [true]
}
