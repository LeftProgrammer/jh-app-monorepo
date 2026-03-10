# 工具函数模块使用指南

## 概述

提供常用的工具函数，包括页面处理、路由辅助、日期格式化、加解密等功能，为 uni-app 开发提供便利的工具支持。

## 模块结构

### 📋 核心工具

- **index.ts** - 统一导出入口
- **pageHelper.ts** - 页面处理工具
- **routerHelper.ts** - 路由辅助工具
- **date.ts** - 日期格式化工具
- **encrypt.ts** - 加解密工具
- **constants/** - 常量定义
- **validator.ts** - 验证器工具
- **systemInfo.ts** - 系统信息工具
- **uploadFile.ts** - 文件上传工具
- **download.ts** - 下载工具
- **debounce.ts** - 防抖工具
- **tree.ts** - 树形数据处理工具
- **appUpdate.ts** - 应用更新工具
- **toLoginPage.ts** - 登录页跳转工具
- **url.ts** - URL 处理工具

## 导出方式

### 🎯 直接导出

```typescript
// 导入所有工具函数
import { 
  getPageConfig,
  isPageTabbar,
  getLastPage,
  currRoute,
  formatDate,
  deepClone
} from '@jinghe-sanjiaoroad-app/app/utils'
```

### 🎯 命名空间导出

```typescript
// 按分类导入工具函数
import { 
  utilsPage,
  utilsDate,
  utilsEncrypt,
  utilsConstants,
  utilsValidator,
  utilsRouter,
  utilsSystem,
  utilsUpload,
  utilsDownload,
  utilsDebounce,
  utilsTree,
  utilsUpdate,
  utilsLogin
} from '@jinghe-sanjiaoroad-app/app/utils'

// 使用
const { isPageTabbar } = utilsPage
const { formatDate } = utilsDate
const { AES } = utilsEncrypt
```

## 使用指南

### 📱 页面处理工具

#### **页面配置**
```typescript
import { getPageConfig } from '@jinghe-sanjiaoroad-app/app/utils'

// 获取页面配置
const config = getPageConfig({
  pages: [
    { path: 'index/index', type: 'home' },
    { path: 'login/login' }
  ],
  subPackages: [
    { root: 'sub1', pages: [{ path: 'page1' }] }
  ]
})
```

#### **页面状态**
```typescript
import { getLastPage, currRoute } from '@jinghe-sanjiaoroad-app/app/utils'

// 获取最后页面
const lastPage = getLastPage()

// 获取当前路由
const route = currRoute()
console.log('当前路径:', route.path)
console.log('查询参数:', route.query)
```

#### **Tabbar 判断**
```typescript
import { isPageTabbar } from '@jinghe-sanjiaoroad-app/app/utils'

// 检查是否为 Tabbar 页面
const isTabbar = isPageTabbar('/pages/index/index', [
  '/pages/index/index',
  '/pages/user/index'
])
```

### 📅 日期处理工具

#### **日期格式化**
```typescript
import { formatDate } from '@jinghe-sanjiaoroad-app/app/utils'

// 格式化日期
const formattedDate = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
const today = formatDate() // 默认格式 YYYY-MM-DD
const time = formatDate(Date.now(), 'HH:mm:ss')
```

### 🔐 加解密工具

#### **AES 加密**
```typescript
import { AES } from '@jinghe-sanjiaoroad-app/app/utils'

// AES 加密
const encrypted = AES.encrypt('hello world', 'secret-key')
const decrypted = AES.decrypt(encrypted, 'secret-key')

// 支持环境变量配置
// VITE_APP_API_ENCRYPT_ENABLE=true 时自动启用
```

#### **RSA 加密**
```typescript
import { RSA } from '@jinghe-sanjiaoroad-app/app/utils'

// RSA 加密
const rsa = new RSA()
const encrypted = rsa.encrypt('hello world', publicKey)
const decrypted = rsa.decrypt(encrypted, privateKey)
```

### 🎯 常量工具

#### **业务常量**
```typescript
import { utilsConstants } from '@jinghe-sanjiaoroad-app/app/utils'

// BPM 枚举
const { BPM_ENUM } = utilsConstants

// 系统枚举
const { SYSTEM_ENUM } = utilsConstants

// 字典枚举
const { DICT_ENUM } = utilsConstants
```

### 🔧 系统信息工具

#### **获取导航栏高度**
```typescript
import { getNavbarHeight } from '@jinghe-sanjiaoroad-app/app/utils'

// 获取导航栏高度（考虑状态栏和胶囊按钮）
const navbarHeight = getNavbarHeight()
```

#### **环境配置**
```typescript
import { getEnvBaseUrl, isDoubleTokenMode } from '@jinghe-sanjiaoroad-app/app/utils'

// 获取环境基准地址
const baseUrl = getEnvBaseUrl()

// 检查是否双 Token 模式
const isDouble = isDoubleTokenMode()
```

### 📤 文件上传工具

#### **文件上传**
```typescript
import { utilsUpload } from '@jinghe-sanjiaoroad-app/app/utils'

// 使用上传工具
const { uploadFile } = utilsUpload
```

### 📥 下载工具

#### **文件下载**
```typescript
import { utilsDownload } from '@jinghe-sanjiaoroad-app/app/utils'

// 使用下载工具
const { downloadFile } = utilsDownload
```

### 🌳 树形数据处理

#### **树形操作**
```typescript
import { utilsTree } from '@jinghe-sanjiaoroad-app/app/utils'

// 使用树形工具
const { treeToList, listToTree } = utilsTree
```

### 🔄 防抖工具

#### **防抖处理**
```typescript
import { utilsDebounce } from '@jinghe-sanjiaoroad-app/app/utils'

// 使用防抖工具
const { debounce } = utilsDebounce
```

### 🔙 验证器工具

#### **表单验证**
```typescript
import { utilsValidator } from '@jinghe-sanjiaoroad-app/app/utils'

// 使用验证器
const { validateEmail, validatePhone } = utilsValidator
```

### 🔄 应用更新工具

#### **更新检查**
```typescript
import { utilsUpdate } from '@jinghe-sanjiaoroad-app/app/utils'

// 使用更新工具
const { checkUpdate, downloadUpdate } = utilsUpdate
```

### 🏠 登录页跳转

#### **登录跳转**
```typescript
import { utilsLogin } from '@jinghe-sanjiaoroad-app/app/utils'

// 跳转到登录页
const { toLoginPage } = utilsLogin
```

### 🔗 URL 处理工具

#### **URL 解析**
```typescript
import { parseUrlToObj, ensureDecodeURIComponent } from '@jinghe-sanjiaoroad-app/app/utils'

// 解析 URL
const urlObj = parseUrlToObj('/pages/login?redirect=%2Fhome')
// 结果: { path: '/pages/login', query: { redirect: '/home' } }

// URL 解码
const decodedUrl = ensureDecodeURIComponent('%2Fpages%2Flogin')
```

### 🎯 深拷贝工具

#### **对象深拷贝**
```typescript
import { deepClone } from '@jinghe-sanjiaoroad-app/app/utils'

// 深拷贝对象
const original = { a: 1, b: { c: 2 } }
const cloned = deepClone(original)

// 支持循环引用
const circular = { a: 1 }
circular.self = circular
const clonedCircular = deepClone(circular) // 正确处理循环引用
```

## 最佳实践

### ✅ 推荐用法

#### **1. 按需导入**
```typescript
// 只导入需要的工具函数
import { formatDate, deepClone } from '@jinghe-sanjiaoroad-app/app/utils'
```

#### **2. 命名空间导入**
```typescript
// 按分类导入，避免命名冲突
import { utilsDate, utilsEncrypt } from '@jinghe-sanjiaoroad-app/app/utils'
const { formatDate } = utilsDate
const { AES } = utilsEncrypt
```

#### **3. 类型安全**
```typescript
// 所有工具函数都有完整的 TypeScript 类型定义
const date: string = formatDate(new Date())
const cloned: User = deepClone(user)
```

### ⚠️ 注意事项

#### **1. 环境变量**
```typescript
// 加密功能通过环境变量控制
VITE_APP_API_ENCRYPT_ENABLE=true  // 启用 API 加密
VITE_APP_API_ENCRYPT_ALGORITHM=AES  // 加密算法
VITE_APP_API_ENCRYPT_REQUEST_KEY=xxx  // 请求密钥
VITE_APP_API_ENCRYPT_RESPONSE_KEY=xxx  // 响应密钥
```

#### **2. 平台兼容**
```typescript
// 部分工具函数考虑了平台差异
// 微信小程序特殊处理
// H5、App 端通用处理
```

#### **3. 性能优化**
```typescript
// deepClone 使用 WeakMap 优化性能
// 防抖工具避免频繁执行
// 树形数据转换使用高效算法
```

## 故障排除

### 🔧 常见问题

#### **1. 加密功能不工作**
```typescript
// 检查环境变量配置
console.log('加密启用:', import.meta.env.VITE_APP_API_ENCRYPT_ENABLE)
console.log('加密算法:', import.meta.env.VITE_APP_API_ENCRYPT_ALGORITHM)
```

#### **2. 页面路由获取失败**
```typescript
// 确保 pages.json 配置正确
// 检查页面栈是否为空
const pages = getCurrentPages()
if (pages.length === 0) {
  console.warn('页面栈为空')
}
```

#### **3. 深拷贝循环引用**
```typescript
// 使用内置的 WeakMap 处理
// 不要手动传递 WeakMap 参数
const cloned = deepClone(obj) // 自动处理循环引用
```

## 依赖说明

### 📦 内部依赖
- `@uni-helper/vite-plugin-uni-pages` - 页面类型定义
- `@uni-helper/uni-env` - 环境判断
- `crypto-js` - 加密库
- `jsencrypt` - RSA 加密库
- `dayjs` - 日期处理库

### 📦 外部依赖
- `uni-app` - uni-app 框架
- TypeScript - 类型支持

## 更新日志

### 📝 版本记录
- **v1.0.0** - 初始版本，包含基础工具函数
- **v1.1.0** - 添加分类导出和命名空间支持
- **v1.2.0** - 完善文档和使用示例
