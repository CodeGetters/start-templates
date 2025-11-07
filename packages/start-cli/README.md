# @start-templates/cli

CLI 工具用于快速创建和管理项目模板。

## 安装

在 monorepo 根目录运行：

```bash
pnpm install
```

## 开发

```bash
# 开发模式（监听文件变化）
pnpm --filter @start-templates/cli dev

# 构建
pnpm --filter @start-templates/cli build
```

## 测试

### 方法 1: 使用 npm scripts（推荐）

```bash
# 测试帮助命令
pnpm --filter @start-templates/cli test

# 测试列表命令
pnpm --filter @start-templates/cli test:list

# 测试版本命令
pnpm --filter @start-templates/cli test:version

# 测试创建命令（非交互式）
pnpm --filter @start-templates/cli test:create
```

### 方法 2: 直接使用 node 运行

```bash
cd packages/start-cli

# 构建项目
pnpm build

# 测试帮助
node dist/index.js --help

# 测试列表
node dist/index.js list

# 测试版本
node dist/index.js version

# 测试创建（交互式）
node dist/index.js create
```

### 方法 3: 开发模式测试

```bash
# 启动开发模式（自动监听文件变化）
pnpm --filter @start-templates/cli dev

# 在另一个终端运行（使用 tsx 直接运行 TypeScript）
cd packages/start-cli
tsx src/index.ts list
tsx src/index.ts version
tsx src/index.ts create
```

### 方法 4: 本地链接测试（全局使用）

```bash
cd packages/start-cli
pnpm build
pnpm link --global

# 现在可以在任何地方使用 start 命令
start list
start version
start create my-project
```

## 使用

### 通过包管理器创建（推荐）

```bash
# 使用 npm
npm create start@latest my-project
npm create start@latest my-project -- --template vue-ts

# 使用 yarn
yarn create start my-project
yarn create start my-project --template vue-ts

# 使用 pnpm
pnpm create start my-project
pnpm create start my-project --template vue-ts
```

### 直接使用 CLI 命令

```bash
# 交互式创建
start create

# 指定项目名称
start create my-project

# 指定模板
start create my-project -t react-ts

# 指定目标目录
start create my-project -d ./projects
```

### 列出所有模板

```bash
start list
# 或
start ls
```

### 查看版本

```bash
start version
# 或
start v
```

## 命令

- `start create [name]` - 从模板创建新项目
  - `-t, --template <template>` - 指定模板名称
  - `-d, --dir <dir>` - 指定目标目录（默认为当前目录）

- `start list` - 列出所有可用的模板

- `start version` - 显示版本信息

## 项目结构

```
start-cli/
├── src/
│   ├── index.ts          # CLI 入口文件
│   └── commands/         # 命令实现目录
│       ├── create.ts     # 创建项目命令
│       ├── list.ts       # 列出模板命令
│       └── version.ts   # 版本信息命令
├── dist/                 # 构建输出目录
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
└── README.md             # 项目文档
```

## 源码说明

### `src/index.ts` - CLI 入口文件

这是 CLI 工具的主入口文件，负责：

- **信号处理**：优雅处理 `SIGINT` (Ctrl+C) 和 `SIGTERM` 信号
- **命令注册**：使用 `commander` 注册所有 CLI 命令
- **错误处理**：统一处理命令执行错误
- **参数解析**：解析命令行参数并路由到对应的命令处理器

主要功能：

- 注册 `create`、`list`、`version` 命令
- 为每个命令设置别名（如 `c`、`ls`、`v`）
- 配置错误输出格式
- 无参数时显示帮助信息

### `src/commands/create.ts` - 创建项目命令

实现项目创建功能：

**功能特性**：

- 交互式项目名称输入（使用 `inquirer`）
- 交互式模板选择（React、Vue、Node.js、Vanilla）
- 支持命令行参数直接指定项目名称和模板
- 目录存在性检查
- 项目目录创建
- 优雅的错误处理和用户取消操作处理

**参数**：

- `name?: string` - 项目名称（可选，未提供时交互式询问）
- `options.template?: string` - 模板名称（可选）
- `options.dir?: string` - 目标目录（默认当前目录）

**交互流程**：

1. 如果没有提供项目名称，提示用户输入
2. 如果没有提供模板，显示模板列表供用户选择
3. 检查目标目录是否已存在
4. 创建项目目录
5. 显示成功信息和后续步骤

### `src/commands/list.ts` - 列出模板命令

显示所有可用的项目模板：

**功能**：

- 列出所有预定义的模板
- 显示每个模板的名称、描述和版本
- 提供使用提示

**当前支持的模板**：

- `react-ts` - React + TypeScript 模板
- `vue-ts` - Vue 3 + TypeScript 模板
- `node-ts` - Node.js + TypeScript 模板
- `vanilla` - Vanilla JavaScript 模板

### `src/commands/version.ts` - 版本信息命令

显示 CLI 工具的版本信息：

**功能**：

- 显示当前 CLI 版本号
- 使用彩色输出提升可读性

## 技术栈

- **commander** - 命令行参数解析和命令注册
- **chalk** - 终端彩色输出
- **inquirer** - 交互式命令行提示
- **TypeScript** - 类型安全的开发体验
- **tsup** - 快速构建工具（基于 esbuild）

## 开发指南

### 添加新命令

1. 在 `src/commands/` 目录下创建新命令文件，例如 `new-command.ts`
2. 导出命令处理函数
3. 在 `src/index.ts` 中导入并注册命令：

```typescript
import { newCommand } from './commands/new-command.js'

program
  .command('new-command')
  .alias('nc')
  .description('New command description')
  .action(newCommand)
```

### 添加新模板

在 `src/commands/list.ts` 中的 `templates` 数组添加新模板：

```typescript
const templates = [
  // ... 现有模板
  {
    name: 'new-template',
    description: 'New template description',
    version: '1.0.0',
  },
]
```

然后在 `src/commands/create.ts` 的模板选择列表中添加对应的选项。
