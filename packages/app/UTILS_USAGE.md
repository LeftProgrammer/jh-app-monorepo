# Utils 模块使用指南

## 📦 概述

框架包提供了丰富的工具函数,支持日期处理、加密解密、表单验证、文件上传下载等常用功能。

---

## 🚀 使用方式

### **方式1: 从框架包主入口导入 (推荐)**

```typescript
import { 
  formatDateTime,
  DICT_TYPE,
  isMobile,
  debounce,
  deepClone,
  AES,
  handleTree
} from '@jinghe-sanjiaoroad-app/framework'

// 使用
const date = formatDateTime(new Date())
const isValid = isMobile('13800138000')
```

**优点:**
- ✅ 最简单直接
- ✅ 所有工具统一导入
- ✅ 支持 Tree Shaking

---

### **方式2: 保留项目本地 utils (适用于有特殊需求的项目)**

如果你的项目依赖 `pages.json` 或有特定的业务逻辑,可以保留本地 utils:

```typescript
// src/utils/index.ts
import type { PageMetaDatum } from '@uni-helper/vite-plugin-uni-pages'
import { pages } from '@/pages.json'

// 从框架包导入通用工具
export { 
  formatDateTime,
  DICT_TYPE,
  isMobile 
} from '@jinghe-sanjiaoroad-app/framework'

// 项目特定实现
export function getAllPages() {
  return pages.map(page => `/${page.path}`)
}

export const HOME_PAGE = `/${pages[0].path}`
```

**使用:**
```typescript
import { formatDateTime, getAllPages, HOME_PAGE } from '@/utils'
```

---

## 📚 工具函数分类

### **1. 日期工具**

```typescript
import { 
  formatDate,
  formatDateTime,
  formatDateTimeHour,
  formatDateRange,
  formatPast 
} from '@jinghe-sanjiaoroad-app/framework'

// 格式化日期
formatDate(new Date())                    // '2024-03-12'
formatDateTime(new Date())                // '2024-03-12 14:30:00'
formatDateTimeHour(new Date())            // '2024-03-12 14:30'

// 格式化日期范围
formatDateRange([startDate, endDate])     // ['2024-03-01 00:00:00', '2024-03-12 23:59:59']

// 格式化过去时间
formatPast(new Date(Date.now() - 3600000)) // '1小时前'
```

---

### **2. 常量枚举**

```typescript
import { 
  DICT_TYPE,
  CommonStatusEnum,
  BpmTaskStatusEnum 
} from '@jinghe-sanjiaoroad-app/framework'

// 字典类型
DICT_TYPE.USER_TYPE           // 'user_type'
DICT_TYPE.COMMON_STATUS       // 'common_status'

// 通用状态
CommonStatusEnum.ENABLE       // 0
CommonStatusEnum.DISABLE      // 1

// BPM 任务状态
BpmTaskStatusEnum.PENDING     // 1
BpmTaskStatusEnum.APPROVED    // 2
```

---

### **3. 表单验证**

```typescript
import { 
  isMobile,
  isBlank,
  isEmail,
  validateIdCard,
  validateEmail,
  validatePhone 
} from '@jinghe-sanjiaoroad-app/framework'

// 验证手机号
isMobile('13800138000')                   // true

// 验证空值
isBlank('')                               // true
isBlank(null)                             // true

// 验证邮箱
isEmail('test@example.com')               // true

// 验证身份证
validateIdCard('110101199001011234')      // true
```

---

### **4. 加密解密**

```typescript
import { AES, RSA } from '@jinghe-sanjiaoroad-app/framework'

// AES 加密
const encrypted = AES.encrypt('hello', 'my-secret-key')
const decrypted = AES.decrypt(encrypted, 'my-secret-key')

// RSA 加密
const publicKey = '-----BEGIN PUBLIC KEY-----...'
const privateKey = '-----BEGIN PRIVATE KEY-----...'

const encrypted = RSA.encrypt('hello', publicKey)
const decrypted = RSA.decrypt(encrypted, privateKey)
```

---

### **5. 防抖节流**

```typescript
import { debounce } from '@jinghe-sanjiaoroad-app/framework'

// 防抖函数
const debouncedSearch = debounce((keyword: string) => {
  console.log('搜索:', keyword)
}, 300)

// 使用
debouncedSearch('hello')

// 取消
debouncedSearch.cancel()

// 立即执行
debouncedSearch.flush()
```

---

### **6. 树形数据处理**

```typescript
import { handleTree } from '@jinghe-sanjiaoroad-app/framework'

const flatData = [
  { id: 1, name: '节点1', parentId: 0 },
  { id: 2, name: '节点1-1', parentId: 1 },
  { id: 3, name: '节点1-2', parentId: 1 },
]

const tree = handleTree(flatData, 'id', 'parentId')
// [
//   {
//     id: 1,
//     name: '节点1',
//     children: [
//       { id: 2, name: '节点1-1' },
//       { id: 3, name: '节点1-2' }
//     ]
//   }
// ]
```

---

### **7. 文件上传下载**

```typescript
import { 
  uploadFileFromPath,
  createUploadTask,
  saveImageToAlbum 
} from '@jinghe-sanjiaoroad-app/framework'

// 上传文件
const fileId = await uploadFileFromPath('/path/to/file.jpg')

// 创建上传任务
const task = createUploadTask('/upload', { name: 'file' })

// 保存图片到相册
await saveImageToAlbum('https://example.com/image.jpg')
```

---

### **8. 其他工具**

```typescript
import { 
  deepClone,
  getNavbarHeight,
  getEnvBaseUrl,
  isDoubleTokenMode 
} from '@jinghe-sanjiaoroad-app/framework'

// 深拷贝
const cloned = deepClone({ a: 1, b: { c: 2 } })

// 获取导航栏高度
const height = getNavbarHeight()

// 获取环境基础URL
const baseUrl = getEnvBaseUrl()

// 是否双token模式
if (isDoubleTokenMode) {
  // ...
}
```

---

## ⚠️ 注意事项

### **1. 依赖 pages.json 的函数**

以下函数依赖项目的 `pages.json`,框架包提供了参数化版本:

```typescript
import { getAllPages, getHomePage } from '@jinghe-sanjiaoroad-app/framework'
import { pages, subPackages } from '@/pages.json'

// 需要传入 pagesConfig
const allPages = getAllPages({ pages, subPackages })
const homePage = getHomePage({ pages })
```

**建议:** 在项目本地封装一层:

```typescript
// src/utils/index.ts
import { getAllPages as getAllPagesFromFramework } from '@jinghe-sanjiaoroad-app/framework'
import { pages, subPackages } from '@/pages.json'

export function getAllPages(key?: string) {
  return getAllPagesFromFramework({ pages, subPackages }, key)
}
```

---

### **2. 依赖 tabbar/store 的函数**

`redirectAfterLogin` 和 `navigateBackPlus` 依赖 `isPageTabbar` 判断,建议在项目本地实现。

---

## 📝 迁移指南

### **从项目本地 utils 迁移到框架包**

**步骤1: 识别可以替换的函数**

可以直接替换的:
- ✅ 日期工具 (formatDate, formatDateTime 等)
- ✅ 常量枚举 (DICT_TYPE, CommonStatusEnum 等)
- ✅ 验证工具 (isMobile, isEmail 等)
- ✅ 加密工具 (AES, RSA)
- ✅ 防抖工具 (debounce)
- ✅ 树形工具 (handleTree)
- ✅ 深拷贝 (deepClone)

需要保留本地实现的:
- ⚠️ getAllPages (依赖 pages.json)
- ⚠️ HOME_PAGE (依赖 pages.json)
- ⚠️ redirectAfterLogin (依赖 tabbar/store)
- ⚠️ navigateBackPlus (依赖 tabbar/store)

**步骤2: 修改导入语句**

```typescript
// 修改前
import { formatDateTime } from '@/utils/date'
import { DICT_TYPE } from '@/utils/constants'

// 修改后
import { formatDateTime, DICT_TYPE } from '@jinghe-sanjiaoroad-app/framework'
```

**步骤3: 验证功能**

确保所有功能正常运行后,可以删除本地重复的实现。

---

## 🎯 最佳实践

1. **优先使用框架包** - 减少重复代码
2. **保留特定实现** - 项目特定逻辑保留在本地
3. **统一导入方式** - 从框架包主入口导入
4. **类型安全** - 充分利用 TypeScript 类型提示

---

## 📖 完整示例

```typescript
// src/pages/example.vue
<script setup lang="ts">
import { ref } from 'vue'
import { 
  formatDateTime,
  DICT_TYPE,
  isMobile,
  debounce,
  AES 
} from '@jinghe-sanjiaoroad-app/framework'

// 日期格式化
const currentTime = formatDateTime(new Date())

// 表单验证
const phone = ref('')
const isValidPhone = computed(() => isMobile(phone.value))

// 防抖搜索
const search = debounce((keyword: string) => {
  console.log('搜索:', keyword)
}, 300)

// 数据加密
const encryptData = (data: string) => {
  return AES.encrypt(data, 'secret-key')
}
</script>
```

---

## 🔗 相关文档

- [框架包完整 API 文档](./API.md)
- [类型定义](./dist/index.d.ts)
- [示例项目](../../playground)
