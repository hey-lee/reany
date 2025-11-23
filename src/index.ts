#!/usr/bin/env node

import { program } from 'commander'
import { commandInit } from './commands/init'
import { commandAdd } from './commands/add'
import { commandBuild } from './commands/build'

program
  .name(`reany`)
  .description(`reuse any component in any project`)
  .version(`0.0.0`, `-v, --version`, `show version`)

program
  .command(`init`)
  .description(`Initialize the project`)
  .action(commandInit)

program
  .command(`add <components...>`)
  .description(`Add a component to your project`)
  .action(commandAdd)

program
  .command(`build`)
  .description(`build components for reany repos`)
  .action(commandBuild)

program.parse(process.argv)

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp()
}
