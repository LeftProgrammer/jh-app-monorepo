# Hooks 模块使用指南

## 概述

jinghe-sanjiaoroad App 框架的 Hooks 模块，提供常用的 Vue 3 组合函数，包括权限控制、字典处理、请求管理、滚动加载和文件上传等功能。

## 模块列表

### 📋 useAccess - 权限控制

提供基于角色和权限码的权限判断方法。

**导出：**
- `useAccess` - 权限控制 Hook
- `access` - 权限模块命名空间

**使用示例：**
```typescript
// 方式1: 直接导入
import { useAccess } from '@jinghe-sanjiaoroad-app/framework/hooks'
const { hasAccessByRoles, hasAccessByCodes } = useAccess()

// 方式2: 命名空间导入
import { access } from '@jinghe-sanjiaoroad-app/framework/hooks'
const { hasAccessByRoles, hasAccessByCodes } = access.useAccess()

// 权限判断
const canEdit = hasAccessByRoles(['admin'])
const canView = hasAccessByCodes(['user:view'])
```

### 📋 dict - 字典工具

提供字典数据的获取和处理工具函数。

**导出：**
- `dict` - 字典工具函数集合

**使用示例：**
```typescript
import { dict } from '@jinghe-sanjiaoroad-app/framework/hooks'
const { getDictLabel, getDictObj, getIntDictOptions } = dict

// 获取字典标签
const statusText = getDictLabel('user_status', 1)

// 获取字典选项
const statusOptions = getIntDictOptions('user_status')

// 获取字典对象
const statusObj = getDictObj('user_status', 1)
```

### 📋 useRequest - 请求处理

提供异步请求的状态管理和执行控制。

**导出：**
- `useRequest` - 请求处理 Hook
- `request` - 请求模块命名空间

**使用示例：**
```typescript
// 方式1: 直接导入
import { useRequest } from '@jinghe-sanjiaoroad-app/framework/hooks'
const { loading, data, error, execute } = useRequest(
  async () => {
    const response = await api.getUsers()
    return response.data
  },
  { immediate: true }
)

// 方式2: 命名空间导入
import { request } from '@jinghe-sanjiaoroad-app/framework/hooks'
const { loading, data, error, execute } = request.useRequest(...)
```

### 📋 useScroll - 滚动加载

提供分页加载和刷新功能。

**导出：**
- `useScroll` - 滚动加载 Hook
- `scroll` - 滚动模块命名空间

**使用示例：**
```typescript
// 方式1: 直接导入
import { useScroll } from '@jinghe-sanjiaoroad-app/framework/hooks'
const { list, loading, finished, refresh, loadMore } = useScroll({
  fetchData: async (page, pageSize) => {
    const response = await api.getUsers({ page, pageSize })
    return response.data
  },
  pageSize: 20
})

// 方式2: 命名空间导入
import { scroll } from '@jinghe-sanjiaoroad-app/framework/hooks'
const { list, loading, finished, refresh, loadMore } = scroll.useScroll(...)
```

### 📋 useUpload - 文件上传

提供文件选择、上传和状态管理功能。

**导出：**
- `useUpload` - 文件上传 Hook
- `upload` - 上传模块命名空间

**使用示例：**
```typescript
// 方式1: 直接导入
import { useUpload } from '@jinghe-sanjiaoroad-app/framework/hooks'
const { 
  loading, 
  error, 
  progress, 
  chooseFile, 
  uploadFile, 
  clearFile 
} = useUpload({
  fileType: 'image',
  maxSize: 5 * 1024 * 1024, // 5MB
  onSuccess: (url) => {
    console.log('上传成功:', url)
  }
})

// 方式2: 命名空间导入
import { upload } from '@jinghe-sanjiaoroad-app/framework/hooks'
const { loading, chooseFile } = upload.useUpload(...)
```

## 统一导入

### 🎯 便捷导入方式

```typescript
// 导入所有主要 Hook
import { 
  useAccess, 
  useRequest, 
  useScroll, 
  useUpload, 
  dict 
} from '@jinghe-sanjiaoroad-app/framework/hooks'
```

### 🎯 命名空间导入方式

```typescript
// 导入所有命名空间
import { 
  access, 
  request, 
  scroll, 
  upload, 
  dict 
} from '@jinghe-sanjiaoroad-app/framework/hooks'

// 使用
const { hasAccessByRoles } = access.useAccess()
const { getDictLabel } = dict
const { loading, execute } = request.useRequest(...)
```

## 最佳实践

### ✅ 推荐用法

1. **权限控制**
   ```typescript
   // 在组件中使用权限控制
   const { hasAccessByRoles } = useAccess()
   
   <button v-if="hasAccessByRoles(['admin'])">
     删除
   </button>
   ```

2. **字典数据处理**
   ```typescript
   // 在表格中使用字典
   const { getDictLabel } = dict
   
   <template #status="{ row }">
     {{ getDictLabel('user_status', row.status) }}
   </template>
   ```

3. **异步请求**
   ```typescript
   // 在页面加载时获取数据
   const { loading, data, error } = useRequest(
     async () => await api.getUsers(),
     { immediate: true }
   )
   ```

4. **滚动加载**
   ```typescript
   // 在列表页面使用滚动加载
   const { list, loading, loadMore } = useScroll({
     fetchData: async (page, pageSize) => await api.getUsers({ page, pageSize })
   })
   ```

5. **文件上传**
   ```typescript
   // 在表单中使用文件上传
   const { chooseFile, loading } = useUpload({
     fileType: 'image',
     onSuccess: (url) => formData.avatar = url
   })
   ```

### ✅ 错误处理

```typescript
// 统一的错误处理
const { loading, error, execute } = useRequest(async () => {
  try {
    const response = await api.getData()
    return response.data
  } catch (err) {
    console.error('请求失败:', err)
    throw err
  }
})

// 监听错误
watch(error, (err) => {
  if (err) {
    showToast('请求失败，请重试')
  }
})
```

### ✅ 类型安全

```typescript
// 使用 TypeScript 类型
interface User {
  id: number
  name: string
  status: number
}

const { data } = useRequest<User[]>(async () => await api.getUsers())
const { list } = useScroll<User>({
  fetchData: async (page, pageSize) => await api.getUsers({ page, pageSize })
})
```

