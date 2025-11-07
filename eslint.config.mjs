import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  unocss: true,
  vue: true,
  react: true,
  ignores: ['dist', 'node_modules', 'coverage'],
  rules: {
    // CLI 工具需要大量使用 console.log 输出信息
    'no-console': 'off',
    // Node.js 环境中 process 是全局可用的，不需要 require
    'node/prefer-global/process': 'off',
    // 允许内联类型导入（更灵活）
    'import/consistent-type-specifier-style': 'off',
  },
})
