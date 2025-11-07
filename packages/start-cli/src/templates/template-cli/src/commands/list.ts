import chalk from 'chalk'

const templates = [
  {
    name: 'react-ts',
    description: 'React + TypeScript template',
    version: '1.0.0',
  },
  {
    name: 'vue-ts',
    description: 'Vue 3 + TypeScript template',
    version: '1.0.0',
  },
  {
    name: 'node-ts',
    description: 'Node.js + TypeScript template',
    version: '1.0.0',
  },
  {
    name: 'vanilla',
    description: 'Vanilla JavaScript template',
    version: '1.0.0',
  },
]

export async function listCommand() {
  console.log(chalk.blue('📦 Available templates:\n'))

  templates.forEach((template) => {
    console.log(
      `  ${chalk.green(template.name.padEnd(15))} ${chalk.gray(template.description)} ${chalk.dim(`(v${template.version})`)}`,
    )
  })

  console.log(
    chalk.gray(
      `\nUse ${chalk.cyan('{{cli-name}} create <name> -t <template>')} to create a project\n`,
    ),
  )
}
