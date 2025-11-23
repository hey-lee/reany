export const isUrl = (text: string) => {
  if (!text) return false
  return /^https?:\/\/[^\s/$.?#][^\s]*[^\s.]$/i.test(text)
}

export const isValidRepoUrl = (text: string) => {
  return isUrl(text) && text.endsWith(`{name}.json`)
}

export const isValidTplUrl = (text: string) => {
  return isUrl(text) && text.endsWith(`{name}.json`)
}

export const isResponseOk = async (url: string) => {
  try {
    const response = await fetch(url)
    return response.ok
  } catch {
    return false
  }
}

export const isScoped = (str: string): boolean => {
  return /^@[^/]+\/[^/]+$/.test(str)
}

export const parseScope = (text: string): [string, string] => {
  const match = text.match(/^@([^/]+)\/(.+)$/)
  if (!match) {
    throw new Error(`Invalid scoped package format: ${text}`)
  }
  return [match[1], match[2]]
}
