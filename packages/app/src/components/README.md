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

根据字典类型和值，渲染对应的彩色标签（基于 `wd-tag`）。

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `type` | `string` | — | 字典类型（必填） |
| `value` | `any` | — | 字典值（必填） |
| `plain` | `boolean` | `false` | 是否镂空样式 |

内部将后端 `colorType` 映射为 `wd-tag` 的 `type`（`info` → `default`，其余直接映射）。

```vue
<jh-dict-tag type="system_user_sex" :value="userSex" />
<jh-dict-tag type="bpm_process_status" :value="status" plain />
```

**依赖：** `getDictObj`（hooks 模块）、`wd-tag`（wot-design-uni）。

---

### jh-file-upload 文件上传

基于 `wd-upload` 封装，支持通过 `fileId`（逗号分隔的 ID 字符串或数组）双向绑定，自动回显已上传文件。

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `v-model:file-id` | `string \| number \| (string \| number)[]` | — | 文件 ID（逗号分隔字符串、数字或数组） |
| `action` | `string` | `'/infra/file/upload-file'` | 上传接口地址 |
| `returnObject` | `boolean` | `false` | 为 `true` 时 `update:fileId` 返回完整文件对象列表，否则返回逗号分隔的 ID 字符串 |

除上述 props 外，所有 `wd-upload` 的属性均可通过 `v-bind` 透传（如 `limit`、`disabled`、`accept` 等）。

| Events | 说明 |
|--------|------|
| `update:fileId` | 文件变更时触发，返回 ID 字符串或文件对象列表 |
| `update:fileList` | 原始文件列表更新 |
| `change` | 文件变更事件 |
| `success` / `fail` / `progress` / `oversize` / `remove` | 透传 `wd-upload` 事件 |
| `chooseerror` | 选择文件出错 |

**核心能力：**

- **ID 回显**：传入 `fileId`（如 `"1,2,3"`），自动调用 `getFileByIds` 接口加载文件信息并展示
- **对象数组回显**：传入 `UploadFileItem[]` 数组时直接使用，无需请求接口
- **预览增强**：非图片/视频文件自动下载后调用 `uni.openDocument` 打开

```vue
<jh-file-upload v-model:file-id="formData.fileIds" :limit="3" />
<jh-file-upload v-model:file-id="formData.file" disabled />
```

**依赖：** `wd-upload`（wot-design-uni）、`getFileByIds`（api/infra/file）。

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
| `update:modelValue` | 选中值变更（逗号分隔的 ID 字符串） |
| `confirm` | 确认选择，参数 `(ids: string, users: User[])` |

| Expose | 说明 |
|--------|------|
| `getUserNickname(userId)` | 根据用户 ID 获取昵称 |

```vue
<jh-user-picker v-model="formData.userId" label="负责人" />
<jh-user-picker v-model="formData.userIds" type="checkbox" label="参与人" />
```

**依赖：** `wd-select-picker`（wot-design-uni）、`useUserStore`（store 模块）。

---

### jh-unit-picker 单位选择器

基于 `wd-select-picker` 封装，支持单选/多选项目单位。组件挂载时自动加载单位列表。

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `v-model` | `string \| string[]` | — | 选中的单位 ID（多选时逗号分隔） |
| `type` | `'radio' \| 'checkbox'` | `'radio'` | 单选/多选 |
| `label` | `string` | `''` | 表单标签（为空时隐藏标签列） |
| `placeholder` | `string` | `'请选择'` | 占位文本 |

| Events | 说明 |
|--------|------|
| `update:modelValue` | 选中值变更 |

| Expose | 说明 |
|--------|------|
| `getUnitname(unitId)` | 根据单位 ID 获取单位名称 |

```vue
<jh-unit-picker v-model="formData.unitId" label="所属单位" />
```

**依赖：** `wd-select-picker`（wot-design-uni）、`getList`（api/system/unit）。

---

### jh-tabbar 自定义 Tabbar

完整封装的 Tabbar 解决方案，支持多种策略（原生/自定义/有缓存/无缓存）、鼓包按钮、角标、主题配置等。

**模块组成：**

| 文件 | 说明 |
|------|------|
| `jh-tabbar.vue` | Tabbar 渲染组件（内部调用 `useTabbarStore`，无需传 props） |
| `index.ts` | 统一入口：`defineTabbar`（一步完成配置和注册） |
| `config.ts` | 配置工厂函数 `createTabbarConfig` |
| `store.ts` | 状态管理：`initTabbarStore`（注册）+ `useTabbarStore`（懒创建） |
| `types.ts` | 类型定义 + `TABBAR_STRATEGY_MAP` 常量 |

**策略选项（`TABBAR_STRATEGY_MAP`）：**

| 策略 | 值 | 说明 |
|------|-----|------|
| `NO_TABBAR` | 0 | 无 tabbar |
| `NATIVE_TABBAR` | 1 | 完全原生 tabbar |
| `CUSTOM_TABBAR_WITH_CACHE` | 2 | 自定义 tabbar + 页面缓存（推荐） |
| `CUSTOM_TABBAR_WITHOUT_CACHE` | 3 | 自定义 tabbar，无页面缓存 |

**使用步骤（3 步）：**

```ts
// 1. tabbar/config.ts — 定义并注册配置
import { defineTabbar } from '@jinghe-sanjiaoroad-app/framework/components'

const { tabBar } = defineTabbar({
  strategy: TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE,
  customItems: [
    { text: '首页', pagePath: 'pages/home/index', iconType: 'image', icon: '/static/tabbar/home.png', iconActive: '/static/tabbar/home-active.png' },
    { text: '任务', pagePath: 'pages/bpm/index', iconType: 'image', icon: '/static/tabbar/task.png', iconActive: '/static/tabbar/task-active.png', badge: 'todoTotal' },
    { text: '我的', pagePath: 'pages/my/index', iconType: 'image', icon: '/static/tabbar/my.png', iconActive: '/static/tabbar/my-active.png' },
  ],
  getBadgeValue: (key) => { /* 从全局状态获取 */ },
})

export { tabBar } // 供 pages.config.ts 使用

// 2. main.ts — 确保路由拦截器之前完成初始化
import './tabbar/config'

// 3. 页面模板中直接使用（easycom 自动引入）
```

```vue
<jh-tabbar />
```

组件内部通过 `useTabbarStore()` 获取配置和状态，**无需传入 props**。

| Events | 说明 |
|--------|------|
| `bulge-click` | 鼓包按钮点击 |
| `item-click` | 项目点击，参数 `(index, item)` |

**运行时 API（`useTabbarStore`）：**

```ts
import { useTabbarStore } from '@jinghe-sanjiaoroad-app/framework/components'

const { config, tabbarList, tabbarStore, isPageTabbar } = useTabbarStore()

tabbarStore.setCurIdx(0)             // 设置当前选中
tabbarStore.setAutoCurIdx('/pages/home/index')  // 根据路径自动选中
tabbarStore.setTabbarItemBadge(1, 5) // 设置角标
isPageTabbar('/pages/home/index')    // 判断是否 tabbar 页面
```

**`TabbarConfigOptions` 配置项：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `strategy` | `TabbarStrategy` | `CUSTOM_TABBAR_WITH_CACHE` | 策略 |
| `customItems` | `CustomTabBarItem[]` | — | 自定义项目列表（必填） |
| `nativeItems` | `NativeTabBarItem[]` | `[]` | 原生项目列表 |
| `bulgeEnable` | `boolean` | `false` | 启用鼓包（项目数必须为偶数） |
| `theme` | `{ activeColor, inactiveColor }` | `#009688 / #666` | 主题色 |
| `tabBarConfig` | `Partial<TabBar>` | 见 config.ts | pages.json tabBar 配置 |
| `bulgeImage` | `string` | `/static/framework/tabbar/scan.png` | 鼓包图片 |
| `getBadgeValue` | `(key: string) => number \| undefined` | — | 角标值获取函数 |
| `onBulgeClick` | `() => void` | toast 提示 | 鼓包点击回调 |
| `beforeNavigate` | `(index, item) => boolean \| void` | `() => true` | 导航前拦截 |
| `checkLogin` | `(pagePath) => boolean` | `() => true` | 登录检查 |

---

## 开发规范

- 组件命名：`jh-xxx`，文件结构 `jh-xxx/jh-xxx.vue`
- 使用 `<script setup lang="ts">` + TypeScript
- Props 使用 `defineProps<T>()` 泛型方式定义
- 通过 `defineExpose` 暴露必要方法
- 组件内部依赖使用相对路径引用框架内模块
