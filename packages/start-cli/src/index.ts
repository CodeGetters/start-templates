#!/usr/bin/env node

import chalk from 'chalk'
import { Command } from 'commander'
import { createCommand } from './commands/create.js'
import { listCommand } from './commands/list.js'
import { versionCommand } from './commands/version.js'

// 优雅处理退出信号
// SIGINT: 用户按 Ctrl+C
// SIGTERM: 系统或其他进程请求终止（如 kill 命令、进程管理器）
function handleExit() {
  console.log(chalk.gray('\n\n👋 Operation cancelled.'))
  process.exit(0)
}

process.on('SIGINT', handleExit) // Ctrl+C
process.on('SIGTERM', handleExit) // 系统终止请求

const program = new Command()

program
  .name('start')
  .description('CLI tool for managing start templates')
  .version('1.0.0')

// 创建命令
program
  .command('create')
  .alias('c')
  .description('Create a new project from template')
  .argument('[name]', 'Project name')
  .option('-t, --template <template>', 'Template name')
  .option('-d, --dir <dir>', 'Target directory', process.cwd())
  .action(async (...args) => {
    try {
      await createCommand(...args)
    }
    catch (error: any) {
      // 如果 createCommand 没有处理错误，在这里捕获
      if (error?.name === 'ExitPromptError' || error?.message?.includes('SIGINT')) {
        console.log(chalk.gray('\n👋 Operation cancelled.'))
        process.exit(0)
      }
      else {
        console.log(chalk.red(`\n❌ Error: ${error?.message || error}`))
        process.exit(1)
      }
    }
  })

// 列表命令
program
  .command('list')
  .alias('ls')
  .description('List all available templates')
  .action(listCommand)

// 版本命令
program
  .command('version')
  .alias('v')
  .description('Show version information')
  .action(versionCommand)

// 错误处理
program.configureOutput({
  writeErr: (str: string) => {
    process.stderr.write(chalk.red(str))
  },
})

// 解析命令行参数
program.parse()

// 如果没有提供命令，显示帮助信息
if (!process.argv.slice(2).length) {
  program.outputHelp()
}
