import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import prompts from 'prompts'
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

/**
 * Adds one or more components to the project.
 * A component can be:
 * 1. A full URL pointing to a Reany repository JSON.
 * 2. A scoped package like @scope/name, resolved via the config file.
 * 3. A shorthand like "owner:repo", mapped to http://localhost:3000/r/owner/repo.json.
 *
 * @param components - List of component strings to add.
 *
 * @example
 * // Add from a full URL
 * $ reany add https://reany.example.com/repos/my-lib.json
 *
 * @example
 * // Add a scoped package (requires config)
 * $ reany add @tailwinds/button
 */

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

/**
 * Adds files to the repository.
 * Iterates over the files array, creates directories if they don't exist,
 * and writes the file content to the specified target path.
 * If the file already exists, prompts the user for confirmation to overwrite.
 *
 * @param files - The files to add to the repository.
 */
const addFiles = async (files: Reany.File[]) => {
  for (const file of files) {
    const dirname = path.dirname(path.join(process.cwd(), file.target))
    fs.mkdirSync(dirname, { recursive: true })

    if (file.content) {
      if (!fs.existsSync(file.target)) {
        fs.writeFileSync(file.target, file.content)
        return
      }
      const { overwrite } = await prompts({
        type: `confirm`,
        name: `overwrite`,
        message: `${chalk.blue(file.target)} already exists, do you want to overwrite it?`,
        initial: false,
      })
      if (overwrite) {
        fs.writeFileSync(file.target, file.content)
      }
    }
  }
}

/**
 * Fetches a repository from the given URL.
 * Reads the repository JSON, validates its schema, and adds its files to the repository.
 * Recursively fetches dependencies if any.
 *
 * @param component - The URL of the repository to fetch.
 * @throws {Error} Throws if reading or writing files fails.
 */
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
