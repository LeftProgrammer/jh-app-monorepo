# Hooks 模块

框架内置的 Vue 3 组合函数，提供权限控制、字典处理、请求管理、滚动加载和文件上传等功能。

## 导入方式

```ts
import {
  useAccess,
  useRequest,
  useScroll,
  useUpload,
  getDictLabel,
  getDictObj,
  getDictOptions,
  getIntDictOptions,
  getStrDictOptions,
  getBoolDictOptions,
} from '@jinghe-sanjiaoroad-app/framework/hooks'
```

## useAccess - 权限控制

基于角色和权限码的权限判断。

| 方法 | 类型 | 说明 |
|------|------|------|
| `hasAccessByRoles` | `(roles: string[]) => boolean` | 判断当前用户是否具有指定角色之一 |
| `hasAccessByCodes` | `(codes: string[]) => boolean` | 判断当前用户是否具有指定权限码之一 |

```ts
const { hasAccessByRoles, hasAccessByCodes } = useAccess()

const canEdit = hasAccessByRoles(['admin', 'editor'])
const canView = hasAccessByCodes(['user:view'])
```

依赖：`useUserStore`（`roles`、`permissions`）。

---

## 字典工具函数

独立导出的工具函数（非 Hook），用于字典数据的获取和转换。

| 函数 | 返回类型 | 说明 |
|------|----------|------|
| `getDictLabel(type, value)` | `string` | 获取字典标签文本 |
| `getDictObj(type, value)` | `DictItem \| null` | 获取完整字典对象（含 label/colorType/cssClass） |
| `getDictOptions(type, valueType?)` | `DictDataType[]` | 获取字典选项列表，`valueType` 可选 `'string'`/`'number'`/`'boolean'` |
| `getIntDictOptions(type)` | `NumberDictDataType[]` | 获取字典选项，value 强制转为 `number` |
| `getStrDictOptions(type)` | `StringDictDataType[]` | 获取字典选项，value 强制转为 `string` |
| `getBoolDictOptions(type)` | `DictDataType[]` | 获取字典选项，value 强制转为 `boolean` |

```ts
const statusText = getDictLabel('user_status', 1) // => '正常'

const statusOptions = getIntDictOptions('user_status')
// => [{ label: '正常', value: 1, colorType: 'success' }, ...]
```

导出类型：`DictDataType`、`NumberDictDataType`、`StringDictDataType`

依赖：`useDictStore`。

---

## useRequest - 请求处理

异步请求的状态管理和执行控制。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `func` | `(args?: P) => Promise<T>` | 异步请求函数 |
| `options.immediate` | `boolean` | 是否立即执行，默认 `false` |
| `options.initialData` | `T` | 初始数据 |

**返回值：**

| 属性 | 类型 | 说明 |
|------|------|------|
| `loading` | `Ref<boolean>` | 加载状态 |
| `error` | `Ref<boolean \| Error>` | 错误状态 |
| `data` | `Ref<T \| undefined>` | 响应数据 |
| `run` | `(args?: P) => Promise<T \| undefined>` | 手动触发请求 |

```ts
// 手动触发
const { loading, data, run } = useRequest(
  async (params) => await api.searchUsers(params)
)
await run({ keyword: '张三' })
```

---

## useScroll - 滚动分页

分页加载和下拉刷新。挂载时自动加载第一页。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `fetchData` | `(page: number, pageSize: number) => Promise<T[]>` | 分页请求函数（必填） |
| `pageSize` | `number` | 每页数量，默认 `10` |

**返回值：**

| 属性 | 类型 | 说明 |
|------|------|------|
| `list` | `Ref<T[]>` | 累积的数据列表 |
| `loading` | `Ref<boolean>` | 加载状态 |
| `finished` | `Ref<boolean>` | 是否已加载全部 |
| `error` | `Ref<any>` | 错误信息 |
| `refresh` | `() => Promise<void>` | 重置并重新加载第一页 |
| `loadMore` | `() => Promise<void>` | 加载下一页 |

```ts
const { list, loading, finished, refresh, loadMore } = useScroll<User>({
  fetchData: async (page, pageSize) => {
    const res = await api.getUsers({ pageNo: page, pageSize })
    return res.list
  },
  pageSize: 20,
})
```

---

## useUpload - 文件上传

文件选择与上传，支持图片和文件类型，兼容 H5/小程序/App。

**参数（`options`）：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `fileType` | `'image' \| 'file'` | `'image'` | 选择类型 |
| `maxSize` | `number` | `5 * 1024 * 1024` | 文件大小上限（字节） |
| `formData` | `Record<string, any>` | `{}` | 上传附加表单数据 |
| `accept` | `string[]` | `['*']` | 允许的文件扩展名 |
| `success` | `(data: any) => void` | — | 上传成功回调 |
| `error` | `(err: any) => void` | — | 上传失败回调 |

**返回值：**

| 属性 | 类型 | 说明 |
|------|------|------|
| `loading` | `Ref<boolean>` | 上传中状态 |
| `error` | `Ref<Error \| null>` | 错误信息 |
| `data` | `Ref<any>` | 上传成功后的响应数据 |
| `run` | `() => void` | 触发文件选择并上传 |

```ts
const { loading, data, run } = useUpload({
  fileType: 'image',
  maxSize: 10 * 1024 * 1024,
  success: (res) => console.log('上传成功', res),
})
run()
```

上传地址：`${getBaseUrl()}/infra/file/upload-file`，自动携带鉴权 header。

---

## 目录结构

```
hooks/
├── index.ts         # 统一导出
├── useAccess.ts     # 权限控制
├── useDict.ts       # 字典工具函数
├── useRequest.ts    # 异步请求管理
├── useScroll.ts     # 滚动分页
├── useUpload.ts     # 文件上传
└── README.md
```
