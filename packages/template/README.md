# JH App 模板项目

这是一个基于 JH App 框架创建的 uni-app 项目模板。

## 🚀 快速开始

### 1. 安装依赖
```bash
pnpm install
```

### 2. 开发模式
```bash
# H5 端开发
pnpm dev

# 微信小程序开发
pnpm dev:mp-weixin

# APP 开发
pnpm dev:app
```

### 3. 构建项目
```bash
# 构建 H5
pnpm build:h5

# 构建微信小程序
pnpm build:mp-weixin

# 构建 APP
pnpm build:app
```

## 📋 项目结构

```
src/
├── main.ts              # 应用入口
├── App.vue              # 根组件
├── pages.json           # 页面配置
├── manifest.json        # 应用配置
└── pages/              # 页面目录
    └── index/
        └── index.vue  # 首页
```

## 🎯 功能特性

### 框架集成
- ✅ **HTTP 请求** - 统一的请求封装
- ✅ **状态管理** - 基于 Pinia 的状态管理
- ✅ **UI 组件** - 丰富的移动端组件
- ✅ **工具函数** - 实用的工具函数集
- ✅ **路由管理** - 路由拦截和权限控制
- ✅ **配置管理** - 全局配置管理

### 多端支持
- 🌐 **H5** - Web 浏览器端
- 📱 **微信小程序** - 微信小程序
- 📲 **APP** - 原生应用

## 🛠️ 技术栈

- **前端框架**: Vue 3.4+
- **移动端框架**: uni-app 3.0+
- **类型系统**: TypeScript 5.8+
- **状态管理**: Pinia 2.0+
- **构建工具**: Vite 5.2+

## 📝 使用说明

### 框架初始化
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
```

### 功能使用示例
```typescript
// HTTP 请求
import { httpClient } from '@jh-app/app'
const response = await httpClient.get('/api/users')

// 状态管理
import { useUserStore } from '@jh-app/app'
const userStore = useUserStore()

// UI 组件
import { JhButton } from '@jh-app/app'

// 工具函数
import { formatDate, storage } from '@jh-app/app'
const formattedDate = formatDate(new Date(), 'YYYY-MM-DD')
```

## 🎨 自定义配置

### 环境变量
创建 `.env` 文件：
```env
VITE_APP_BASE_URL=https://api.example.com
VITE_APP_TIMEOUT=10000
```

### 主题定制
在 `App.vue` 中自定义样式：
```scss
.jh-app {
  // 自定义主题色
  --primary-color: #007aff;
  --success-color: #28a745;
  --warning-color: #ff9500;
  --error-color: #dc3545;
}
```

## 🔧 扩展开发

### 添加新页面
1. 在 `src/pages/` 下创建页面组件
2. 在 `pages.json` 中注册页面路由
3. 使用框架功能进行开发

### 自定义组件
1. 在 `src/components/` 下创建组件
2. 使用框架提供的工具函数
3. 遵循 Vue 3 组合式 API

### API 集成
1. 使用 `httpClient` 进行请求
2. 在请求拦截器中添加认证信息
3. 使用 `useUserStore` 管理用户状态

## 📱 发布指南

### H5 发布
```bash
pnpm build:h5
# 将 dist 目录部署到服务器
```

### 小程序发布
```bash
pnpm build:mp-weixin
# 使用微信开发者工具上传 dist 目录
```

### APP 发布
```bash
pnpm build:app
# 使用 HBuilderX 打包发布
```

## 🎯 最佳实践

1. **组件开发** - 使用 Vue 3 Composition API
2. **状态管理** - 合理拆分 store 模块
3. **错误处理** - 统一的错误处理机制
4. **性能优化** - 合理使用计算属性和缓存
5. **代码规范** - 遵循 ESLint 和 Prettier 配置

## 🐛 问题排查

### 常见问题
1. **构建失败** - 检查依赖版本兼容性
2. **路由跳转失败** - 检查 pages.json 配置
3. **状态不更新** - 检查 Pinia 使用方式
4. **样式不生效** - 检查样式作用域

### 调试技巧
1. 使用 Vue DevTools 进行组件调试
2. 使用 Network 面板查看 HTTP 请求
3. 使用 console.log 输出调试信息
4. 使用断点调试 TypeScript 代码

---

通过这个模板，你可以快速开始基于 JH App 框架的移动端应用开发！
