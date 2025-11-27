import fs from 'fs'
import chalk from 'chalk'
import { CONFIG_FILE_PATH } from '../config'

/**
 * Initializes a new reany configuration file.
 *
 * Checks if `reany.json` already exists at the configured path.
 * If it does, logs a warning and exits; otherwise, writes a new
 * config file with an empty `repos` object.
 *
 * @example
 * // Run from CLI
 * $ reany init
 * // Creates reany.json with content:
 * // {
 * //   "repos": {}
 * // }
 */
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