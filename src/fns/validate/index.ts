
import type { Rule } from './rules'

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
