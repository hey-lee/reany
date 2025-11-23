
import type { Rule } from './rules'

export const validate = async (text: string, rules: Rule[]) => {
  for (const rele of rules) {
    const isValid = await rele.validate(text)
    if (!isValid) {
      const message = typeof rele.message === 'function' ? rele.message(text) : rele.message
      return [false, message]
    }
  }
  return [true]
}
