# {{project-name}}

{{description}}

## 特性

- ✅ 基于 TypeScript 开发
- ✅ 使用 Commander.js 构建 CLI
- ✅ 支持交互式命令行提示（Inquirer）
- ✅ 优雅的错误处理和信号处理
- ✅ 支持 `npm/yarn/pnpm create` 命令格式
- ✅ 使用 tsup 快速构建
- ✅ 完整的开发工具链

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
# 开发模式（监听文件变化）
pnpm dev

# 构建
pnpm build
```

### 测试

```bash
# 测试帮助命令
pnpm test

# 测试列表命令
pnpm test:list

# 测试版本命令
pnpm test:version

# 测试创建命令（非交互式）
pnpm test:create
```

## 使用

### 通过包管理器创建（推荐）

```bash
# 使用 npm
npm create {{cli-name}}@latest my-project
npm create {{cli-name}}@latest my-project -- --template vue-ts

# 使用 yarn
yarn create {{cli-name}} my-project
yarn create {{cli-name}} my-project --template vue-ts

# 使用 pnpm
pnpm create {{cli-name}} my-project
pnpm create {{cli-name}} my-project --template vue-ts
```

### 直接使用 CLI 命令

```bash
# 交互式创建
{{cli-name}} create

# 指定项目名称
{{cli-name}} create my-project

# 指定模板
{{cli-name}} create my-project -t react-ts

# 指定目标目录
{{cli-name}} create my-project -d ./projects
```

### 列出所有模板

```bash
{{cli-name}} list
# 或
{{cli-name}} ls
```

### 查看版本

```bash
{{cli-name}} version
# 或
{{cli-name}} v
```

## 命令

- `{{cli-name}} create [name]` - 从模板创建新项目
  - `-t, --template <template>` - 指定模板名称
  - `-d, --dir <dir>` - 指定目标目录（默认为当前目录）

- `{{cli-name}} list` - 列出所有可用的模板

- `{{cli-name}} version` - 显示版本信息

## 项目结构

```
{{project-name}}/
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

### `src/commands/create.ts` - 创建项目命令

实现项目创建功能：

**功能特性**：

- 交互式项目名称输入（使用 `inquirer`）
- 交互式模板选择
- 支持命令行参数直接指定项目名称和模板
- 目录存在性检查
- 项目目录创建
- 优雅的错误处理和用户取消操作处理

### `src/commands/list.ts` - 列出模板命令

显示所有可用的项目模板。

### `src/commands/version.ts` - 版本信息命令

显示 CLI 工具的版本信息。

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

## 占位符说明

此模板使用以下占位符，在创建项目时需要替换：

- `{{project-name}}` - 项目名称（package.json 中的 name）
- `{{cli-name}}` - CLI 命令名称（bin 中的命令名）
- `{{description}}` - 项目描述
- `{{keywords}}` - 项目关键词（可选）

## License

MIT
