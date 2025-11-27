
import type { Rule } from './rules'

/**
 * Validates a text against a set of rules.
 * Iterates over each rule, asynchronously validating the text.
 * If a rule fails, returns a tuple with `false` and the rule's error message.
 * If all rules pass, returns a tuple with `true`.
 *
 * @param text - The text to validate.
 * @param rules - The rules to apply to the text.
 * @returns A tuple with `true` if validation passes, or `false` and an error message if validation fails.
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
