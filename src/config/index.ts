import fs from 'fs'
import path from 'path'

export interface Config {
  repos: Record<string, string>
}

export const CONFIG_FILE_PATH = path.join(process.cwd(), `reany.json`)

export const hasConfig = () => {
  return fs.existsSync(CONFIG_FILE_PATH)
}

export const readConfig = () => {
  return JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, `utf-8`))
}