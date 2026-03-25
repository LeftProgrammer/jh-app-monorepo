# 工具函数模块

## 模块结构

| 文件 | 说明 |
|------|------|
| `index.ts` | 统一导出入口 + 页面/路由核心工具 |
| `constants.ts` | 常量聚合导出 |
| `constants/` | 业务枚举常量（BPM、Infra、System、Dict） |
| `date.ts` | 日期格式化（基于 dayjs） |
| `debounce.ts` | 防抖函数（fork from es-toolkit） |
| `download.ts` | 文件下载 / 保存到相册 / 静态资源 URL |
| `encrypt.ts` | API 加解密（AES / RSA） |
| `routerHelper.ts` | 异步组件注册 `registerComponent` |
| `systemInfo.ts` | 系统信息 / 安全区域（带缓存） |
| `toLoginPage.ts` | 跳转登录页（带防抖） |
| `tree.ts` | 树形数据处理（`handleTree` / `findChildren`） |
| `uploadFile.ts` | 文件上传（支持 server / client 直连模式） |
| `url.ts` | tabBar 页面参数传递 |
| `validator.ts` | 表单验证（手机号、邮箱、IP） |
| `appUpdate.ts` | 应用版本更新检查 |
| `updateManager.wx.ts` | 微信小程序热更新 |

## 导入方式

```typescript
// 按需导入（推荐）
import {
  formatDate,
  deepClone,
  isPageTabbar,
  currRoute,
  getLastPage,
} from '@jinghe-sanjiaoroad-app/framework/utils'
```

## 常用 API

### 页面 / 路由

```typescript
import {
  currRoute,
  getLastPage,
  isPageTabbar,
  parseUrlToObj,
  getAllPages,
  getHomePage,
  redirectAfterLogin,
  navigateBackPlus,
  getNavbarHeight,
} from '@jinghe-sanjiaoroad-app/framework/utils'

// 获取当前路由
const { path, query } = currRoute()

// 解析 URL
parseUrlToObj('/pages/login?redirect=%2Fhome')
// => { path: '/pages/login', query: { redirect: '/home' } }

// 登录后跳转（自动判断 tabbar 页面）
redirectAfterLogin(query.redirect)

// 增强返回（无上一页时跳首页）
navigateBackPlus('/pages/fallback/index')
```

### 日期处理

```typescript
import { formatDate, formatDateTime, formatPast } from '@jinghe-sanjiaoroad-app/framework/utils'

formatDate(new Date(), 'YYYY-MM-DD')     // '2025-01-01'
formatDateTime(Date.now())                // '2025-01-01 12:00:00'
formatPast('2025-01-01 10:00:00')         // '2小时前'
```

### 文件上传

```typescript
import { uploadFileFromPath, createUploadTask } from '@jinghe-sanjiaoroad-app/framework/utils'

// 从路径上传（自动选择 server/client 模式）
const url = await uploadFileFromPath(filePath, 'avatar')

// 创建带 UI 交互的上传任务
const { loading, data, run } = createUploadTask('/infra/file/upload-file', {}, {
  maxSize: 10,
  onSuccess: (res) => console.log('上传成功', res),
})
run() // 弹出选择器并上传
```

### 文件下载 / 静态资源

```typescript
import {
  saveImageToAlbum,
  formatFileSize,
  frameworkStaticUrl,
  staticUrl,
} from '@jinghe-sanjiaoroad-app/framework/utils'

// 保存图片到相册（多端兼容）
await saveImageToAlbum('https://example.com/image.png')

// 格式化文件大小
formatFileSize(1024 * 1024) // '1.00 MB'

// 静态资源 URL
frameworkStaticUrl('/logo.svg')  // 框架内部资源
staticUrl('/banner.png')         // 项目资源
```

### 防抖

```typescript
import { debounce } from '@jinghe-sanjiaoroad-app/framework/utils'

const debouncedSearch = debounce((keyword: string) => {
  // 搜索逻辑
}, 300)

debouncedSearch('hello')
debouncedSearch.cancel()  // 取消
debouncedSearch.flush()   // 立即执行
```

### 树形数据

```typescript
import { handleTree, findChildren } from '@jinghe-sanjiaoroad-app/framework/utils'

// 扁平数组 → 树形结构
const tree = handleTree(flatList)

// 查找子节点
const children = findChildren(tree, parentId)
```

### 表单验证

```typescript
import { isMobile, isEmail, isIp, isBlank } from '@jinghe-sanjiaoroad-app/framework/utils'

isMobile('13800138000')  // true
isEmail('test@example.com')  // true
isBlank('')  // true
```

### 系统信息

```typescript
import { getSystemInfo, getSafeAreaInsets } from '@jinghe-sanjiaoroad-app/framework/utils'

const sysInfo = getSystemInfo()  // 带缓存
const insets = getSafeAreaInsets()  // 安全区域边距
```

### 登录跳转

```typescript
import { toLoginPage } from '@jinghe-sanjiaoroad-app/framework/utils'

// 带防抖的登录跳转
toLoginPage({ queryString: '?redirect=/pages/home/index' })

// 立即跳转（跳过防抖）
toLoginPage.flush()
```

### 深拷贝

```typescript
import { deepClone } from '@jinghe-sanjiaoroad-app/framework/utils'

const cloned = deepClone(original)  // 支持循环引用、Map、Set、Date、RegExp
```

### tabBar 参数传递

```typescript
import { setTabParams, getAndClearTabParams } from '@jinghe-sanjiaoroad-app/framework/utils'

// 跳转前设置参数
setTabParams({ type: 'todo' })
uni.switchTab({ url: '/pages/bpm/index' })

// 目标页 onShow 中获取
const params = getAndClearTabParams()  // { type: 'todo' }
```

## 注意事项

- `getAllPages` / `getHomePage` 需要传入 `pages.json` 配置，外部项目应在 `utils/index.ts` 中覆盖实现
- `registerComponent` 需要传入 `import.meta.glob` 结果，必须在项目级调用
- 加密配置通过 `initFramework({ apiEncrypt: { ... } })` 传入，不直接读取环境变量
- `toLoginPage` 有 500ms 防抖，H5 首次加载可能不触发，属于已知行为
