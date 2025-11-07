import { existsSync } from 'node:fs'
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// 获取当前文件所在目录（兼容 ESM）
// 注意：在 CJS 构建中，这会使用 process.cwd() 作为回退
function getCurrentDir() {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.url) {
      return dirname(fileURLToPath(import.meta.url))
    }
  }
  catch {
    // 忽略错误
  }
  // CJS 回退：使用相对于项目根目录的路径
  return join(process.cwd(), 'packages/start-cli/src/utils')
}

const __dirname = getCurrentDir()

export interface TemplateInfo {
  name: string
  description: string
  version: string
  path: string
}

/**
 * 获取模板目录路径
 */
function getTemplatesDir(): string {
  // 优先尝试从 __dirname 相对路径查找（适用于构建后的代码）
  const relativePath = join(__dirname, '../templates')
  if (existsSync(relativePath)) {
    return relativePath
  }

  // 尝试从当前工作目录查找（适用于开发环境）
  const cwd = process.cwd()

  // 检查是否在 packages/start-cli 目录中
  const devPath = join(cwd, 'src/templates')
  if (existsSync(devPath)) {
    return devPath
  }

  // 检查构建后的路径
  const buildPath = join(cwd, 'dist/templates')
  if (existsSync(buildPath)) {
    return buildPath
  }

  // 如果都不存在，返回相对路径（让调用方处理错误）
  return relativePath
}

/**
 * 扫描 templates 目录，获取所有可用的模板
 */
export async function scanTemplates(): Promise<TemplateInfo[]> {
  const templatesDir = getTemplatesDir()
  const templates: TemplateInfo[] = []

  try {
    if (!existsSync(templatesDir)) {
      return templates
    }

    const entries = await readdir(templatesDir, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith('template-')) {
        const templateName = entry.name.replace('template-', '')
        const templatePath = join(templatesDir, entry.name)

        // 尝试读取 package.json 获取模板信息
        let description = `${templateName} template`
        let version = '1.0.0'

        try {
          const packageJsonPath = join(templatePath, 'package.json')
          if (existsSync(packageJsonPath)) {
            const packageJsonContent = await readFile(packageJsonPath, 'utf-8')
            const packageJson = JSON.parse(packageJsonContent)
            description = packageJson.description || description
            version = packageJson.version || version
          }
        }
        catch {
          // 如果读取失败，使用默认值
        }

        templates.push({
          name: templateName,
          description,
          version,
          path: templatePath,
        })
      }
    }
  }
  catch (error) {
    console.error('Error scanning templates:', error)
  }

  return templates
}

/**
 * 根据模板名称获取模板信息
 */
export async function getTemplate(templateName: string): Promise<TemplateInfo | null> {
  const templates = await scanTemplates()
  return templates.find(t => t.name === templateName) || null
}

/**
 * 递归复制目录
 */
async function copyDirectory(src: string, dest: string): Promise<void> {
  await mkdir(dest, { recursive: true })
  const entries = await readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath)
    }
    else {
      await copyFile(srcPath, destPath)
    }
  }
}

/**
 * 替换文件中的占位符
 */
async function replacePlaceholders(filePath: string, replacements: Record<string, string>): Promise<void> {
  const content = await readFile(filePath, 'utf-8')
  let newContent = content

  for (const [placeholder, value] of Object.entries(replacements)) {
    const regex = new RegExp(`\\{\\{${placeholder}\\}\\}`, 'g')
    newContent = newContent.replace(regex, value)
  }

  await writeFile(filePath, newContent, 'utf-8')
}

/**
 * 递归处理目录中的文件，替换占位符
 */
async function processDirectory(dir: string, replacements: Record<string, string>): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      await processDirectory(fullPath, replacements)
    }
    else if (entry.isFile()) {
      // 只处理文本文件
      const ext = entry.name.split('.').pop()?.toLowerCase()
      const textExtensions = ['json', 'md', 'ts', 'js', 'tsx', 'jsx', 'txt', 'yml', 'yaml']

      if (textExtensions.includes(ext || '')) {
        await replacePlaceholders(fullPath, replacements)
      }
    }
  }
}

/**
 * 复制模板到目标目录并替换占位符
 */
export async function copyTemplate(
  templatePath: string,
  targetPath: string,
  replacements: Record<string, string>,
): Promise<void> {
  // 复制模板目录
  await copyDirectory(templatePath, targetPath)

  // 替换占位符
  await processDirectory(targetPath, replacements)
}
