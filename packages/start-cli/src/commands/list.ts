import chalk from 'chalk'
import { scanTemplates } from '../utils/templates.js'

export async function listCommand() {
  console.log(chalk.blue('📦 Available templates:\n'))

  try {
    const templates = await scanTemplates()

    if (templates.length === 0) {
      console.log(chalk.yellow('  No templates found.\n'))
      return
    }

    templates.forEach((template) => {
      console.log(
        `  ${chalk.green(template.name.padEnd(15))} ${chalk.gray(template.description)} ${chalk.dim(`(v${template.version})`)}`,
      )
    })

    console.log(
      chalk.gray(
        `\nUse ${chalk.cyan('start create <name> -t <template>')} to create a project\n`,
      ),
    )
  }
  catch (error: any) {
    console.log(
      chalk.red(`\n❌ Error loading templates: ${error?.message || error}\n`),
    )
  }
}
