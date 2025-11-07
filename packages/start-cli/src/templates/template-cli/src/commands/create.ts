import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import chalk from 'chalk'
import inquirer from 'inquirer'

export async function createCommand(
  name?: string,
  options?: {
    template?: string
    dir?: string
  },
) {
  try {
    console.log(chalk.blue('🚀 Creating new project...\n'))

    // 如果没有提供项目名称，询问用户
    let projectName = name
    if (!projectName) {
      try {
        const answer = await inquirer.prompt([
          {
            type: 'input',
            name: 'projectName',
            message: 'What is your project name?',
            default: 'my-project',
            validate: (input: string) => {
              if (!input.trim()) {
                return 'Project name cannot be empty'
              }
              return true
            },
          },
        ])
        projectName = answer.projectName
      }
      catch (error: any) {
        // 处理用户取消操作（Ctrl+C）
        if (
          error?.name === 'ExitPromptError'
          || error?.message?.includes('SIGINT')
        ) {
          console.log(chalk.gray('\n\n👋 Operation cancelled.'))
          process.exit(0)
        }
        throw error
      }
    }

    // 如果没有提供模板，询问用户
    let template = options?.template
    if (!template) {
      try {
        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'template',
            message: 'Select a template:',
            choices: [
              { name: 'React + TypeScript', value: 'react-ts' },
              { name: 'Vue + TypeScript', value: 'vue-ts' },
              { name: 'Node.js + TypeScript', value: 'node-ts' },
              { name: 'Vanilla JavaScript', value: 'vanilla' },
            ],
          },
        ])
        template = answer.template
      }
      catch (error: any) {
        // 处理用户取消操作（Ctrl+C）
        if (
          error?.name === 'ExitPromptError'
          || error?.message?.includes('SIGINT')
        ) {
          console.log(chalk.gray('\n\n👋 Operation cancelled.'))
          process.exit(0)
        }
        throw error
      }
    }

    const targetDir = options?.dir || process.cwd()
    const projectPath = join(targetDir, projectName!)

    // 检查目录是否已存在
    if (existsSync(projectPath)) {
      console.log(chalk.red(`❌ Directory ${projectName} already exists!`))
      process.exit(1)
    }

    // 创建项目目录
    try {
      mkdirSync(projectPath, { recursive: true })
      console.log(chalk.green(`✅ Created directory: ${projectName}`))
    }
    catch (error) {
      console.log(chalk.red(`❌ Failed to create directory: ${error}`))
      process.exit(1)
    }

    console.log(
      chalk.green(`\n✨ Project ${projectName} created successfully!`),
    )
    console.log(chalk.cyan(`\nNext steps:`))
    console.log(chalk.gray(`  cd ${projectName}`))
    console.log(chalk.gray(`  pnpm install`))
    console.log(chalk.gray(`  pnpm dev\n`))
  }
  catch (error: any) {
    // 处理其他错误
    if (
      error?.name === 'ExitPromptError'
      || error?.message?.includes('SIGINT')
    ) {
      console.log(chalk.gray('\n\n👋 Operation cancelled.'))
      process.exit(0)
    }
    else {
      console.log(chalk.red(`\n❌ Error: ${error?.message || error}`))
      process.exit(1)
    }
  }
}
