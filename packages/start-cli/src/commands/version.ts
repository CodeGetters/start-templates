import chalk from 'chalk'

export async function versionCommand() {
  const version = '1.0.0'
  console.log(chalk.blue(`start-cli version: ${chalk.bold(version)}\n`))
}
