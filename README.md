# JH App Monorepo

移动端框架包开发 monorepo 项目，基于 pnpm + workspace + changesets 进行管理。

## 项目结构

```
jh-app-monorepo/
├── packages/
│   ├── core/           # 核心功能包
│   ├── components/     # 组件包
│   └── utils/          # 工具包
├── examples/           # 示例项目
├── .changeset/         # 版本管理配置
├── package.json        # 根配置
├── pnpm-workspace.yaml # workspace 配置
└── tsconfig.json       # TypeScript 配置
```

## 包说明

### @jh-app/core
核心功能包，包含：
- 路由管理
- 状态管理 (Pinia)
- HTTP 请求封装
- 配置管理
- 类型定义

### @jh-app/components
UI 组件包，包含：
- 按钮组件
- 加载组件
- 模态框组件
- 提示组件

### @jh-app/utils
工具函数包，包含：
- 日期处理
- 加密解密
- 本地存储
- 设备信息
- 表单验证

## 开发环境要求

- Node.js >= 20
- pnpm >= 9

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 监听所有包的变化
pnpm dev

# 开发特定包
pnpm --filter @jh-app/core dev
pnpm --filter @jh-app/components dev
pnpm --filter @jh-app/utils dev
```

### 构建

```bash
# 构建所有包
pnpm build

# 构建特定包
pnpm --filter @jh-app/core build
```

### 测试

```bash
# 运行所有测试
pnpm test

# 运行特定包的测试
pnpm --filter @jh-app/core test
```

### 代码检查

```bash
# 运行 ESLint
pnpm lint

# 自动修复
pnpm lint:fix

# 类型检查
pnpm type-check
```

## 版本管理

使用 changesets 进行版本管理：

### 添加变更集

```bash
pnpm changeset
```

### 发布版本

```bash
# 更新版本号
pnpm version-packages

# 发布到 npm
pnpm release
```

## 发布流程

1. 修改代码后运行 `pnpm changeset` 添加变更集
2. 运行 `pnpm version-packages` 更新版本号
3. 运行 `pnpm release` 构建并发布到 npm

## 使用示例

### 安装包

```bash
# 安装核心包
pnpm add @jh-app/core

# 安装组件包
pnpm add @jh-app/components

# 安装工具包
pnpm add @jh-app/utils
```

### 在项目中使用

```typescript
// 导入核心功能
import { httpClient, useUserStore, routerManager } from '@jh-app/core'

// 导入组件
import { JhButton, JhModal } from '@jh-app/components'

// 导入工具函数
import { formatDate, storage, isEmail } from '@jh-app/utils'
```

## 开发规范

### 提交规范

使用 Conventional Commits 规范：

- `feat`: 新功能
- `fix`: 修复
- `docs`: 文档
- `style`: 格式
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试
- `chore`: 构建过程或辅助工具的变动

### 代码规范

- 使用 TypeScript 进行开发
- 遵循 ESLint 和 Prettier 配置
- 组件和函数需要添加适当的类型定义
- 编写单元测试

## 许可证

MIT
