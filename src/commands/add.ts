import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import {
  isUrl,
  isValidTplUrl,
  isScoped,
  parseScope,
  isResponseOk,
} from '../fns'
import { hasConfig, readConfig } from '../config'
import { validate } from '../fns/validate'
import { rules } from '../fns/validate/rules'

export const commandAdd = async (components: string[]) => {
  for (const component of components) {
    if (isUrl(component)) {
      await fetchRepo(component)
    } else {
      if (isScoped(component)) {
        const [scope, name] = parseScope(component)
        if (hasConfig()) {
          const { repos = {} }: Reany.Config = readConfig()
          const tplUrl = repos[`@${scope}`]

          if (!isValidTplUrl(tplUrl)) {
            console.error(
              chalk.red(`Repo template url ${chalk.blue(tplUrl)} is invalid`)
            )
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
        const parts = component.split(`:`)
        const repoUrl = `http://localhost:3000/r/${parts.join(`/`)}.json`
        // const repoUrl = `https://reany.banli.co/r/${parts.join(`/`)}.json``
        
        if (parts.length <= 2 && (await isResponseOk(repoUrl))) {
          fetchRepo(repoUrl)
        } else {
          console.error(chalk.red(`${chalk.blue(component)} is not a valid component`))
        }
      }
    }
  }
}

const addFiles = (files: Reany.File[]) => {
  for (const file of files) {
    const dirname = path.dirname(path.join(process.cwd(), file.target))
    fs.mkdirSync(dirname, { recursive: true })
    file.content && fs.writeFileSync(file.target, file.content)
  }
}

const fetchRepo = async (component: string) => {
  try {
    const response = await fetch(component)
    if (response.ok) {
      const { items, files, repoDependencies } =
        (await response.json()) as Reany.Repo

      if (Array.isArray(files)) addFiles(files)

      if (Array.isArray(items)) {
        for (const item of items) {
          addFiles(item.files)
        }
      }
      if (Array.isArray(repoDependencies)) {
        for (const dep of repoDependencies) {
          if (isUrl(dep)) {
            await fetchRepo(dep)
          }
        }
      }
    }
  } catch (error) {
    console.error(
      chalk.red(`component ${chalk.blue(component)} not a valid schema`)
    )
  }
}
