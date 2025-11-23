import fs from 'fs'
import chalk from 'chalk'
import { CONFIG_FILE_PATH } from '../config'

export const commandInit = () => {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      console.log(chalk.red(`A ${chalk.blue(`reany.json`)} file already exists at ${chalk.blue(CONFIG_FILE_PATH)}.`));
      console.log(chalk.red(`Remove the ${chalk.blue(`reany.json`)} file to start over and run ${chalk.blue(`reany init`)} again.`));
      return
    }
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify({ repos: {} }, null, 2))
  } catch (error) {
    console.error(`Error initializing config file:`, error)
  }
}