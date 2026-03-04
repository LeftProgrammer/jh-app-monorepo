# JH App 框架结构说明

## 📋 项目概述

JH App 是一个基于 uni-app + Vue3 + TypeScript 的移动端框架包，采用 monorepo 架构进行开发和管理。

## 🏗️ 整体架构

```
jh-app-monorepo/
├── packages/                    # 核心包目录
│   ├── core/                # 核心功能包
│   ├── components/           # UI 组件包
│   ├── utils/               # 工具函数包
│   └── template/            # 脚手架工具
├── examples/                   # 示例项目
│   ├── demo/               # 完整示例
│   └── simple/             # 简单示例
├── scripts/                    # 工具脚本
├── docs/                      # 文档
└── 配置文件...
```

## 📦 核心包详解

### @jh-app/core - 核心功能包

**功能模块：**
- **HTTP 请求封装** (`http/index.ts`)
  - 统一的请求接口
  - 请求/响应拦截器
  - 错误处理
  - TypeScript 类型支持

- **状态管理** (`store/index.ts`)
  - 基于 Pinia 的状态管理
  - 用户状态管理
  - 应用状态管理
  - 持久化支持

- **路由管理** (`router/index.ts`)
  - 路由拦截器
  - 权限控制
  - 路由守卫

- **配置管理** (`config/index.ts`)
  - 全局配置管理
  - 环境配置
  - 动态配置更新

- **工具函数** (`utils/index.ts`)
  - 通用工具函数
  - 类型安全
  - 高性能实现

- **类型定义** (`types/index.ts`)
  - 完整的 TypeScript 类型
  - 接口定义
  - 类型导出

### @jh-app/components - UI 组件包

**组件列表：**
- **JhButton** - 按钮组件
  - 多种类型和尺寸
  - 加载状态
  - 自定义样式

- **JhLoading** - 加载组件
- **JhModal** - 模态框组件
- **JhToast** - 提示组件

### @jh-app/utils - 工具函数包

**功能模块：**
- **日期处理** (`date.ts`)
  - 基于 dayjs
  - 格式化、相对时间
  - 日期范围计算

- **加密解密** (`crypto.ts`)
  - MD5、SHA256
  - AES、RSA 加密
  - Base64 编码

- **本地存储** (`storage.ts`)
  - 统一的存储接口
  - 类型安全
  - 错误处理

- **设备信息** (`device.ts`)
  - 设备信息获取
  - 平台判断
  - 网络状态

- **表单验证** (`validation.ts`)
  - 常用验证规则
  - 表单验证器
  - 自定义验证

### create-jh-app - 脚手架工具

**功能特性：**
- 交互式项目创建
- 多种模板选择
- 功能模块选择
- 自动依赖安装

## 🚀 使用方式

### 1. 安装框架

```bash
# 安装核心包
pnpm add @jh-app/core

# 安装组件包
pnpm add @jh-app/components

# 安装工具包
pnpm add @jh-app/utils
```

### 2. 框架初始化

```typescript
import { createApp } from 'vue'
import { createJhApp } from '@jh-app/core'
import App from './App.vue'

const app = createApp(App)

// 使用 JH App 框架
const jhApp = createJhApp({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  platform: 'h5'
})

app.use(jhApp)
app.mount('#app')
```

### 3. 功能使用

```typescript
// HTTP 请求
import { httpClient } from '@jh-app/core'
const response = await httpClient.get('/api/users')

// 状态管理
import { useUserStore } from '@jh-app/core'
const userStore = useUserStore()

// 组件使用
import { JhButton } from '@jh-app/components'

// 工具函数
import { formatDate, storage } from '@jh-app/utils'
```

## 🛠️ 开发指南

### 环境要求
- Node.js >= 20
- pnpm >= 9
- TypeScript >= 5.8

### 开发命令

```bash
# 安装依赖
pnpm install

# 检查框架结构
pnpm check

# 开发模式（监听所有包）
pnpm dev

# 开发特定包
pnpm --filter @jh-app/core dev
pnpm --filter @jh-app/components dev
pnpm --filter @jh-app/utils dev

# 构建所有包
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint
pnpm lint:fix

# 类型检查
pnpm type-check
```

### 发布流程

```bash
# 1. 添加变更集
pnpm changeset

# 2. 更新版本号
pnpm version-packages

# 3. 构建并发布
pnpm release
```

## 📋 示例项目

### demo - 完整示例
- 展示框架完整功能
- 包含多个页面和组件
- 状态管理和路由拦截

### simple - 简单示例
- 基础功能演示
- 快速上手指南
- HTML 版本可直接运行

## 🔧 技术栈

- **前端框架**: Vue 3.4+
- **移动端框架**: uni-app 3.0+
- **类型系统**: TypeScript 5.8+
- **状态管理**: Pinia 2.0+
- **构建工具**: Vite 5.2+
- **代码规范**: ESLint + Prettier
- **版本管理**: Changesets
- **包管理**: pnpm + workspace

## 📝 开发规范

### 提交规范
使用 Conventional Commits：
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

### 命名规范
- 包名：`@jh-app/包名`
- 组件名：`Jh + 组件名`
- 文件名：kebab-case
- 变量名：camelCase

## 🎯 设计原则

1. **模块化设计** - 每个包职责单一，可独立使用
2. **类型安全** - 完整的 TypeScript 类型支持
3. **易于扩展** - 提供插件和扩展机制
4. **性能优先** - 优化包大小和运行时性能
5. **向后兼容** - 保持 API 的稳定性
6. **文档完善** - 提供详细的使用文档

## 📈 后续规划

### 短期目标
- [ ] 完善组件库（更多 UI 组件）
- [ ] 添加单元测试
- [ ] 完善文档和示例
- [ ] 优化构建配置

### 中期目标
- [ ] 添加插件系统
- [ ] 支持主题定制
- [ ] 添加国际化支持
- [ ] 性能监控和优化

### 长期目标
- [ ] 可视化配置工具
- [ ] 在线 playground
- [ ] 社区生态建设
- [ ] 企业级解决方案

---

通过以上架构设计，JH App 框架提供了完整的移动端开发解决方案，既保持了模块化的灵活性，又确保了开发的高效性。
