# 框架组件库

框架内置的通用业务组件，统一以 `jh-` 前缀命名，支持 easycom 自动引入。

## 引入方式

### easycom 自动引入（推荐）

在项目的 `pages.json` 中配置：

```json
{
  "easycom": {
    "custom": {
      "^jh-(.*)": "@jinghe-sanjiaoroad-app/framework/src/components/jh-$1/jh-$1.vue"
    }
  }
}
```

配置后模板中直接使用，无需 import：

```vue
<jh-dict-tag type="system_user_sex" :value="1" />
```

### 手动导入

```ts
import { JhDictTag, JhFileUpload, JhUserPicker, JhUnitPicker } from '@jinghe-sanjiaoroad-app/framework/components'
```

---

## 组件列表

### jh-dict-tag 字典标签

根据字典类型和值，渲染对应的彩色标签。

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `type` | `string` | — | 字典类型（必填） |
| `value` | `any` | — | 字典值（必填） |
| `plain` | `boolean` | `false` | 是否镂空样式 |

**示例：**

```vue
<jh-dict-tag type="system_user_sex" :value="userSex" />
<jh-dict-tag type="bpm_process_status" :value="status" plain />
```

**依赖：** `useDict` hook（`getDictObj`）、`wot-design-uni` 的 `wd-tag`。

---

### jh-file-upload 文件上传

基于 `wd-upload` 封装，支持通过 `fileId`（逗号分隔的 ID 字符串）双向绑定，自动回显已上传文件。

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `v-model:file-id` | `string \| number \| (string \| number)[]` | — | 文件 ID（逗号分隔字符串或数组） |
| `action` | `string` | `'/infra/file/upload-file'` | 上传接口地址 |
| `returnObject` | `boolean` | `false` | 为 `true` 时 `update:fileId` 返回完整文件对象列表，否则返回逗号分隔的 ID 字符串 |

除上述 props 外，所有 `wd-upload` 的属性均可透传（如 `limit`、`disabled`、`accept` 等）。

| Events | 说明 |
|--------|------|
| `update:fileId` | 文件变更时触发，返回 ID 字符串或文件对象列表 |
| `change` | 原始 change 事件 |
| `success` / `fail` / `progress` / `oversize` / `remove` | 透传 `wd-upload` 事件 |

**核心能力：**

- **ID 回显**：传入 `fileId`（如 `"1,2,3"`），自动调用 `getFileByIds` 接口加载文件信息并展示
- **预览增强**：非图片/视频文件自动下载后调用 `uni.openDocument` 打开
- **属性透传**：除 `fileId` 和 `action` 外的所有属性直接透传给 `wd-upload`

**示例：**

```vue
<jh-file-upload v-model:file-id="formData.fileIds" :limit="3" />
<jh-file-upload v-model:file-id="formData.file" disabled />
```

**依赖：** `wd-upload`、`getFileByIds` API。

---

### jh-user-picker 用户选择器

基于 `wd-select-picker` 封装，支持单选/多选用户，数据源来自 `useUserStore().userList`。

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `v-model` | `string \| string[]` | — | 选中的用户 ID（多选时逗号分隔） |
| `type` | `'radio' \| 'checkbox'` | `'radio'` | 单选/多选 |
| `label` | `string` | `''` | 表单标签 |
| `labelWidth` | `string` | `'180rpx'` | 标签宽度 |
| `placeholder` | `string` | `'请选择'` | 占位文本 |
| `clearable` | `boolean` | `true` | 是否可清空 |
| `prop` | `string` | `''` | 表单校验字段名 |
| `useDefaultSlot` | `boolean` | `false` | 是否使用默认插槽自定义触发区域 |

| Events | 说明 |
|--------|------|
| `update:modelValue` | 选中值变更 |
| `confirm` | 确认选择，返回 `(ids, users)` |

| Expose | 说明 |
|--------|------|
| `getUserNickname(userId)` | 根据用户 ID 获取昵称 |

**示例：**

```vue
<jh-user-picker v-model="formData.userId" label="负责人" />
<jh-user-picker v-model="formData.userIds" type="checkbox" label="参与人" />
```

**依赖：** `wd-select-picker`、`useUserStore`。

---

### jh-unit-picker 单位选择器

基于 `wd-select-picker` 封装，支持单选/多选项目单位。

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `v-model` | `string \| string[]` | — | 选中的单位 ID（多选时逗号分隔） |
| `type` | `'radio' \| 'checkbox'` | `'radio'` | 单选/多选 |
| `label` | `string` | `''` | 表单标签 |
| `placeholder` | `string` | `'请选择'` | 占位文本 |

| Expose | 说明 |
|--------|------|
| `getUnitname(unitId)` | 根据单位 ID 获取单位名称 |

**示例：**

```vue
<jh-unit-picker v-model="formData.unitId" label="所属单位" />
```

**依赖：** `wd-select-picker`、`getList` API（`api/system/unit`）。

---

### jh-tabbar 自定义 Tabbar

完整封装的 Tabbar 解决方案，支持多种策略（原生/自定义/有缓存/无缓存）、鼓包按钮、角标、主题配置等。

**模块组成：**

| 文件 | 说明 |
|------|------|
| `jh-tabbar.vue` | Tabbar 渲染组件 |
| `config.ts` | 配置工厂函数 `createTabbarConfig` |
| `store.ts` | 状态管理工厂函数 `createTabbarStore` |
| `types.ts` | 类型定义 |
| `index.ts` | 统一导出 |

**策略选项（`TABBAR_STRATEGY_MAP`）：**

| 策略 | 值 | 说明 |
|------|-----|------|
| `NO_TABBAR` | 0 | 无 tabbar |
| `NATIVE_TABBAR` | 1 | 完全原生 tabbar |
| `CUSTOM_TABBAR_WITH_CACHE` | 2 | 自定义 tabbar + 页面缓存（推荐） |
| `CUSTOM_TABBAR_WITHOUT_CACHE` | 3 | 自定义 tabbar，无页面缓存 |

**使用步骤：**

```ts
// 1. 创建配置
import { createTabbarConfig, TABBAR_STRATEGY_MAP } from '@jinghe-sanjiaoroad-app/framework/components'

const tabbarConfig = createTabbarConfig({
  strategy: TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE,
  customItems: [
    { text: '首页', pagePath: 'pages/index/index', iconType: 'image', icon: '/static/tabbar/home.png', iconActive: '/static/tabbar/home-active.png' },
    { text: '任务', pagePath: 'pages/bpm/index', iconType: 'image', icon: '/static/tabbar/task.png', iconActive: '/static/tabbar/task-active.png', badge: 'todoTotal' },
    { text: '我的', pagePath: 'pages/my/index', iconType: 'image', icon: '/static/tabbar/my.png', iconActive: '/static/tabbar/my-active.png' },
  ],
  getBadgeValue: (key) => { /* 从全局状态获取 */ },
})

// 2. 创建 store
import { createTabbarStore } from '@jinghe-sanjiaoroad-app/framework/components'
const { tabbarList, tabbarStore } = createTabbarStore(tabbarConfig)

// 3. 在页面中使用组件（easycom 自动引入）
```

```vue
<jh-tabbar :config="tabbarConfig" :tabbar-list="tabbarList" :tabbar-store="tabbarStore" />
```

| Props | 类型 | 说明 |
|-------|------|------|
| `config` | `TabbarFullConfig` | Tabbar 完整配置（必填） |
| `tabbarList` | `CustomTabBarItem[]` | Tabbar 项目列表（必填） |
| `tabbarStore` | `TabbarStoreInterface` | Tabbar 状态管理（必填） |
| `getBadgeValue` | `(key: string) => number \| undefined` | 角标值获取函数 |

| Events | 说明 |
|--------|------|
| `bulge-click` | 鼓包按钮点击 |
| `item-click` | 项目点击，参数 `(index, item)` |

---

## 开发规范

- 组件命名：`jh-xxx`，文件结构 `jh-xxx/jh-xxx.vue`
- 使用 `<script setup lang="ts">` + TypeScript
- Props 使用 `defineProps<T>()` 泛型方式定义
- 通过 `defineExpose` 暴露必要方法
- 组件内部依赖使用相对路径引用框架内模块
