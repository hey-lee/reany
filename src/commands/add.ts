import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { isUrl, isValidTplUrl, isScoped, parseScope } from '../fns'
import type { Config } from '../config'
import { hasConfig, readConfig } from '../config'
import { validate } from '../fns/validate'
import { rules } from '../fns/validate/rules'

export const commandAdd = async (components: []) => {
  for (const component of components) {
    if (isUrl(component)) {
      await fetchRepo(component)
    } else {
      if (isScoped(component)) {
        const [scope, name] = parseScope(component)
        if (hasConfig()) {
          const { repos = {} }: Config = readConfig()
          const tplUrl = repos[`@${scope}`]

          if (!isValidTplUrl(tplUrl)) {
            console.error(chalk.red(`Repo template url ${chalk.blue(tplUrl)} is invalid`))
            return
          }

          const repoUrl = tplUrl.replace(`{name}`, name)
          const [isValid, message] = await validate(repoUrl, rules.repoUrl)

          if (!isValid) {
            console.error(message)
            return
          }

          fetchRepo(repoUrl)
        }
      } else {
        // check if is built-in component
      }
    }
  }
}

const addFiles = (files: any[]) => {
  for (const file of files) {
    const dirname = path.dirname(path.join(process.cwd(), file.target))
    fs.mkdirSync(dirname, { recursive: true })
    fs.writeFileSync(file.target, file.content)
  }
}

const fetchRepo = async (component: string) => {
  try {
    const response = await fetch(component)
    if (response.ok) {
      const { items, files, repoDependencies } = await response.json()

      if (Array.isArray(files)) addFiles(files)

      if (Array.isArray(items)) {
        for (const item of items) {
          addFiles(item.files)
        }
      }
      if (Array.isArray(repoDependencies)) {
        for (const repo of repoDependencies) {
          if (isUrl(repo)) {
            await fetchRepo(repo)
          }
        }
      }
    }
  } catch (error) {
    console.error(chalk.red(`component ${chalk.blue(component)} not a valid schema`))
  }
}
