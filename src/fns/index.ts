
/**
 * Checks if the provided text is a valid URL.
 * @param text - The string to test.
 * @returns `true` if the text is a valid URL, otherwise `false`.
 * @example
 * ```ts
 * isUrl("https://example.com"); // true
 * isUrl("not-a-url");           // false
 * ```
 */
export const isUrl = (text: string) => {
  if (!text) return false
  return /^https?:\/\/[^\s/$.?#][^\s]*[^\s.]$/i.test(text)
}

/**
 * Determines whether a URL points to a valid repository JSON template.
 * A valid repo URL must be a valid URL and end with `{name}.json`.
 * @param text - The URL to validate.
 * @returns `true` if the URL is a valid repository template URL, otherwise `false`.
 * @example
 * ```ts
 * isValidRepoUrl("https://example.com/repos/{name}.json"); // true
 * isValidRepoUrl("https://example.com/repos/file.json");   // false
 * ```
 */
export const isValidRepoUrl = (text: string) => {
  return isUrl(text) && text.endsWith(`{name}.json`)
}

/**
 * Determines whether a URL points to a valid template JSON file.
 * A valid template URL must be a valid URL and end with `{name}.json`.
 * @param text - The URL to validate.
 * @returns `true` if the URL is a valid template URL, otherwise `false`.
 * @example
 * ```ts
 * isValidTplUrl("https://example.com/repos/{name}.json"); // true
 * isValidTplUrl("https://example.com/repos/file.json");   // false
 * ```
 */
export const isValidTplUrl = (text: string) => {
  return isUrl(text) && text.endsWith(`{name}.json`)
}

/**
 * Checks if a network request to the given URL returns an OK status.
 * @param url - The URL to test.
 * @returns A promise that resolves to `true` if the response status is OK, otherwise `false`.
 * @example
 * ```ts
 * await isResponseOk("https://example.com/health"); // true (if endpoint is healthy)
 * await isResponseOk("https://invalid.url");        // false
 * ```
 */
export const isResponseOk = async (url: string) => {
  try {
    const response = await fetch(url)
    return response.ok
  } catch {
    return false
  }
}

/**
 * Checks if a string follows the scoped package format (e.g., @scope/package).
 * @param str - The string to test.
 * @returns `true` if the string is a valid scoped package name, otherwise `false`.
 * @example
 * ```ts
 * isScoped("@scope/package"); // true
 * isScoped("package");        // false
 * ```
 */
export const isScoped = (str: string): boolean => {
  return /^@[^/]+\/[^/]+$/.test(str)
}

/**
 * Parses a scoped package name into its scope and package parts.
 * @param text - The scoped package string (e.g., @scope/package).
 * @returns A tuple where the first element is the scope and the second is the package name.
 * @throws {Error} If the input is not in valid scoped package format.
 * @example
 * ```ts
 * parseScope("@scope/utils"); // ["scope", "utils"]
 * parseScope("invalid");      // throws Error
 * ```
 */
export const parseScope = (text: string): [string, string] => {
  const match = text.match(/^@([^/]+)\/(.+)$/)
  if (!match) {
    throw new Error(`Invalid scoped package format: ${text}`)
  }
  return [match[1], match[2]]
}
