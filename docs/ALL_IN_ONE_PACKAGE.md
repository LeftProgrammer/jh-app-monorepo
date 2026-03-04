# JH App 一体化包方案

## 🎯 设计理念

根据你的需求，我们重新设计了架构，将所有功能整合到一个包中，让用户只需要安装一个依赖即可使用全部功能。

## 📦 包结构对比

### 原方案（多包）
```json
{
  "dependencies": {
    "@jh-app/core": "^1.0.0",      // 核心功能
    "@jh-app/components": "^1.0.0", // UI 组件
    "@jh-app/utils": "^1.0.0"      // 工具函数
  }
}
```

### 新方案（一体化）
```json
{
  "dependencies": {
    "@jh-app/app": "^1.0.0"    // 包含所有功能
  }
}
```

## 🚀 使用方式

### 1. 安装
```bash
npm install @jh-app/app
# 或
pnpm add @jh-app/app
# 或
yarn add @jh-app/app
```

### 2. 框架初始化
```typescript
import { createApp } from 'vue'
import { createJhApp } from '@jh-app/app'
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
// 所有功能都从一个包导入
import {
  // HTTP 请求
  httpClient,
  
  // 状态管理
  useUserStore,
  useAppStore,
  
  // 路由管理
  routerManager,
  
  // 配置管理
  configManager,
  
  // UI 组件
  JhButton,
  JhLoading,
  JhModal,
  JhToast,
  
  // 工具函数
  formatDate,
  storage,
  isEmail,
  md5,
  sha256,
  
  // 类型定义
  type JhAppConfig,
  type HttpResponse,
  type ButtonProps
} from '@jh-app/app'
```

## 📋 包含的功能模块

### 🔧 核心功能
- **HTTP 请求封装**
  - 统一的请求接口
  - 请求/响应拦截器
  - 错误处理
  - TypeScript 类型支持

- **状态管理**
  - 基于 Pinia 的状态管理
  - 用户状态管理
  - 应用状态管理
  - 持久化支持

- **路由管理**
  - 路由拦截器
  - 权限控制
  - 路由守卫

- **配置管理**
  - 全局配置管理
  - 环境配置
  - 动态配置更新

### 🎨 UI 组件
- **JhButton** - 按钮组件
  - 多种类型和尺寸
  - 加载状态
  - 自定义样式

- **JhLoading** - 加载组件
- **JhModal** - 模态框组件
- **JhToast** - 提示组件

### 🛠️ 工具函数
- **日期处理**
  - 基于 dayjs
  - 格式化、相对时间
  - 日期范围计算

- **加密解密**
  - MD5、SHA256
  - AES、RSA 加密
  - Base64 编码

- **本地存储**
  - 统一的存储接口
  - 类型安全
  - 错误处理

- **设备信息**
  - 设备信息获取
  - 平台判断
  - 网络状态

- **表单验证**
  - 常用验证规则
  - 表单验证器
  - 自定义验证

## � 开发验证项目

### playground/simple - 简单验证
- 演示基础功能使用
- 快速上手指南
- 可直接在浏览器运行

### playground/template - 模板验证
- 完整的项目结构
- 框架功能集成示例
- 多端构建配置

## �🎯 优势对比

### 原方案优势
- ✅ 模块化程度高
- ✅ 按需引入，包体积小
- ✅ 独立开发和发布
- ✅ 职责清晰

### 新方案优势
- ✅ **安装简单** - 只需安装一个包
- ✅ **使用方便** - 所有功能统一导出
- ✅ **版本统一** - 避免版本不兼容问题
- ✅ **配置简化** - 一次配置，全局生效
- ✅ **文档集中** - 所有功能文档在一起
- ✅ **类型完整** - 统一的类型定义

## 🔄 迁移指南

### 从多包迁移到一体化包

**原代码：**
```typescript
import { httpClient } from '@jh-app/core'
import { JhButton } from '@jh-app/components'
import { formatDate } from '@jh-app/utils'
```

**新代码：**
```typescript
import { httpClient, JhButton, formatDate } from '@jh-app/app'
```

### package.json 更新

**原配置：**
```json
{
  "dependencies": {
    "@jh-app/core": "^1.0.0",
    "@jh-app/components": "^1.0.0",
    "@jh-app/utils": "^1.0.0"
  }
}
```

**新配置：**
```json
{
  "dependencies": {
    "@jh-app/app": "^1.0.0"
  }
}
```

## 📈 发布策略

### 版本管理
- **一体化包**：`@jh-app/app` - 主要发布包
- **独立包**：`@jh-app/core`、`@jh-app/components`、`@jh-app/utils` - 保持开发（可选）

### 使用建议
- **新项目**：直接使用 `@jh-app/app`
- **现有项目**：可以逐步迁移到一体化包
- **特殊需求**：仍可使用独立包，按需引入

## 🛠️ 开发命令

```bash
# 开发一体化包
pnpm --filter @jh-app/app dev

# 构建一体化包
pnpm --filter @jh-app/app build

# 发布一体化包
pnpm --filter @jh-app/app release

# 测试一体化包
cd examples/simple
pnpm install
pnpm dev
```

## 📝 总结

一体化包方案解决了你提到的核心问题：
1. **简化安装** - 只需安装一个包
2. **统一使用** - 所有功能从同一个地方导入
3. **版本一致** - 避免多包版本不匹配
4. **配置统一** - 一次配置，所有模块生效
5. **文档集中** - 所有功能的文档在一起

这样设计既保持了功能的完整性，又大大简化了用户的使用成本！
