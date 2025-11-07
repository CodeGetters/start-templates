# start-templates

这是一个基于 pnpm workspaces 的 monorepo 项目。

## 项目结构

```
start-templates/
├── apps/          # 所有子包目录
│   └── [package-name]/ # 各个子包
├── packages/          # 所有子包目录
│   └── [package-name]/ # 各个子包
├── pnpm-workspace.yaml # pnpm workspace 配置
└── package.json        # 根 package.json
```

## 安装依赖

```bash
pnpm install
```

## 常用命令

### 运行所有包的开发命令
```bash
pnpm dev
```

### 构建所有包
```bash
pnpm build
```

### 运行所有包的测试
```bash
pnpm test
```

### 运行所有包的 lint
```bash
pnpm lint
```

### 清理所有构建产物和依赖
```bash
pnpm clean
```

## 针对特定包的操作

### 运行特定包的开发命令
```bash
pnpm --filter <package-name> dev
```

### 构建特定包
```bash
pnpm --filter <package-name> build
```

### 在特定包中安装依赖
```bash
pnpm --filter <package-name> add <dependency>
```

### 在根目录添加依赖（所有包共享）
```bash
pnpm add -w <dependency>
```

## 添加新包

1. 在 `packages/` 目录下创建新的包目录
2. 在新目录中创建 `package.json` 文件
3. 运行 `pnpm install` 安装依赖

## 包之间的依赖

如果包 A 需要依赖包 B，可以在包 A 的 `package.json` 中这样配置：

```json
{
  "dependencies": {
    "@start-templates/package-b": "workspace:*"
  }
}
```

然后运行 `pnpm install` 即可。