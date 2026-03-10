# jinghe-sanjiaoroad App Monorepo

移动端框架包开发 monorepo 项目，基于 pnpm + workspace + changesets 进行管理。

## 项目结构

```
jinghe-sanjiaoroad-app-monorepo/
├── packages/
│   ├── app/             # 主应用包 (UniApp 框架)
│   └── template/        # 项目模板包
├── playground/          # 测试项目
├── docs/               # 文档
├── .changeset/         # 版本管理配置
├── package.json        # 根配置
├── pnpm-workspace.yaml # workspace 配置
└── tsconfig.json       # TypeScript 配置
```

## 包说明

### @jinghe-sanjiaoroad-app/app
主应用包，包含：
- **UniApp 框架** - 基于 Vue 3 + TypeScript 的移动端开发框架
- **状态管理** - Pinia 状态管理集成
- **路由管理** - 页面路由和导航
- **HTTP 请求** - 统一的 API 请求封装
- **UI 组件** - 基于 wot-design-uni 的组件库
- **工具函数** - 常用的工具函数集合
- **BPMN 流程** - 业务流程管理集成

### @jinghe-sanjiaoroad-app/template
项目模板包，包含：
- **项目初始化模板** - 快速创建新项目的脚手架
- **最佳实践配置** - ESLint、Prettier、TypeScript 配置
- **开发工具集成** - Vite、Husky、Changesets 配置

## 开发环境要求

- Node.js >= 18
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

# 开发主应用包 (推荐)
pnpm dev:app
```

### 构建

```bash
# 构建所有包
pnpm build

# 构建主应用包 (推荐)
pnpm build:app
```

### 代码检查

```bash
# 运行 ESLint (所有包)
pnpm lint

# 运行主应用包的 ESLint (推荐)
pnpm lint:app

# 自动修复
pnpm lint:fix:app

# 类型检查
pnpm type-check:app
```

## 发布

### 发布主应用包

```bash
# 构建并发布 @jinghe-sanjiaoroad-app/app
pnpm release:app
```

### 使用 Changesets 管理版本

```bash
# 添加变更集
pnpm changeset

# 更新版本号
pnpm version-packages

# 发布所有包
pnpm release
```

## 使用示例

### 安装主应用包

```bash
npm install @jinghe-sanjiaoroad-app/app vue pinia @dcloudio/uni-app
```

### 在项目中使用

```typescript
// 导入主应用功能
import { 
  httpClient, 
  useUserStore, 
  formatDate, 
  encryptData 
} from '@jinghe-sanjiaoroad-app/app'

// 导入组件
import { 
  JhButton, 
  JhModal, 
  JhTabbar 
} from '@jinghe-sanjiaoroad-app/app/components'

// 导入样式
import '@jinghe-sanjiaoroad-app/app/style'
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

## 特性

- 🚀 **快速开发** - 基于 UniApp 的一站式移动端开发框架
- 📦 **组件丰富** - 内置常用的 UI 组件和业务组件
- 🔧 **工具齐全** - 提供常用的工具函数和业务逻辑
- 🎯 **类型安全** - 完整的 TypeScript 类型定义
- 📱 **多端支持** - 支持 H5、小程序、App 多端发布
- 🔄 **状态管理** - 集成 Pinia 状态管理
- 🌐 **HTTP 封装** - 统一的 API 请求处理
- 🎨 **主题定制** - 支持主题和样式定制

## 许可证

MIT
