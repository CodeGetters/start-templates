import { existsSync } from 'node:fs'
import { join } from 'node:path'
import chalk from 'chalk'
import inquirer from 'inquirer'
import {
  copyTemplate,
  getTemplate,
  scanTemplates,
  type TemplateInfo,
} from '../utils/templates.js'

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

    // 获取所有可用模板
    const availableTemplates = await scanTemplates()

    if (availableTemplates.length === 0) {
      console.log(
        chalk.red(
          '❌ No templates found. Please add templates to src/templates directory.\n',
        ),
      )
      process.exit(1)
    }

    // 如果没有提供模板，询问用户
    let templateName = options?.template
    if (!templateName) {
      try {
        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'template',
            message: 'Select a template:',
            choices: availableTemplates.map((t: TemplateInfo) => ({
              name: `${t.name} - ${t.description}`,
              value: t.name,
            })),
          },
        ])
        templateName = answer.template
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

    // 确保 templateName 不为 undefined
    if (!templateName) {
      console.log(chalk.red('❌ Template name is required!\n'))
      process.exit(1)
    }

    // 获取模板信息
    const template = await getTemplate(templateName)
    if (!template) {
      console.log(chalk.red(`❌ Template "${templateName}" not found!\n`))
      console.log(chalk.yellow('Available templates:'))
      availableTemplates.forEach((t: TemplateInfo) => {
        console.log(chalk.gray(`  - ${t.name}`))
      })
      console.log()
      process.exit(1)
    }

    // 确保 projectName 不为 undefined
    if (!projectName) {
      console.log(chalk.red('❌ Project name is required!\n'))
      process.exit(1)
    }

    const targetDir = options?.dir || process.cwd()
    const projectPath = join(targetDir, projectName)

    // 检查目录是否已存在
    if (existsSync(projectPath)) {
      console.log(chalk.red(`❌ Directory ${projectName} already exists!`))
      process.exit(1)
    }

    console.log(chalk.cyan(`📦 Using template: ${chalk.bold(template.name)}`))
    console.log(chalk.gray(`   ${template.description}\n`))

    // 复制模板并替换占位符
    try {
      // 生成 CLI 名称（从项目名称推导，或使用项目名称）
      const cliName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')

      // 准备占位符替换
      const replacements: Record<string, string> = {
        'project-name': projectName,
        'cli-name': cliName,
        'description': `${projectName} - A CLI tool`,
        'keywords': 'cli',
      }

      await copyTemplate(template.path, projectPath, replacements)

      console.log(chalk.green(`✅ Created project: ${projectName}`))
      console.log(chalk.green(`✨ Project created successfully!\n`))
      console.log(chalk.cyan(`Next steps:`))
      console.log(chalk.gray(`  cd ${projectName}`))
      console.log(chalk.gray(`  pnpm install`))
      console.log(chalk.gray(`  pnpm dev\n`))
    }
    catch (error: any) {
      console.log(
        chalk.red(`❌ Failed to create project: ${error?.message || error}`),
      )
      process.exit(1)
    }
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
