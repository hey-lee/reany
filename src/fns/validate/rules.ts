import chalk from 'chalk'
import { isResponseOk } from '..'

export interface Rule {
  name: string
  message: string | ((text: string) => string)
  validate: (text: string) => Promise<boolean> | boolean
}

export const rules: Record<string, Rule[]> = {
  repoUrl: [
    {
      name: `url`,
      message: chalk.red(`Repo url not found in section repos in reany.json`),
      validate: (repoUrl: string) => !!repoUrl,
    },
    {
      name: `url`,
      message: (repoUrl: string) => chalk.red(`Repo url ${chalk.blue(repoUrl)} is not accessible.`),
      validate: async (repoUrl: string) => await isResponseOk(repoUrl),
    },
  ],
}
