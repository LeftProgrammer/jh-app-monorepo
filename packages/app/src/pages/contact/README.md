# 📱 通讯录模块

> 零配置可用，组件化封装的移动端通讯录解决方案

## 🎯 设计理念

**减少心智负担，让通讯录开发像搭积木一样简单**

- 🎯 **零配置可用** - 开箱即用，无需学习
- ⚡ **组件化封装** - 高度可复用的组件
- 🔧 **智能默认值** - 自动处理常见场景
- 📱 **一致性体验** - 遵循统一的设计模式

## 🚀 快速开始

### 基础使用（推荐）

```vue
<!-- pages/contact/index.vue -->
<template>
  <view class="contact-page">
    <ContactList
      :departments="departments"
      :users="users"
      @department-click="handleDeptClick"
      @user-click="handleUserClick"
    />
  </view>
</template>

<script setup>
import { ContactList } from '@jinghe-sanjiaoroad-app/app/pages/contact'
</script>
```

### 完整页面使用

```vue
<template>
  <view class="contact-page">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="通讯录"
      left-arrow
      @click-left="handleBack"
    />
    
    <!-- 面包屑导航 -->
    <ContactBreadcrumb
      v-model="currentDeptId"
      @change="handleBreadcrumbChange"
    />
    
    <!-- 通讯录列表 -->
    <ContactList
      :departments="currentDepartments"
      :users="currentUsers"
      :loading="loading"
      @department-click="handleEnterDept"
      @user-click="handleUserClick"
    />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ContactList, ContactBreadcrumb } from '@jinghe-sanjiaoroad-app/app/pages/contact'
</script>
```

## 📱 组件介绍

### 📋 组件清单

| 组件 | 用途 | 配置难度 | 推荐度 |
|------|------|----------|--------|
| **ContactPage** | 完整通讯录页面 | ⭐ | ⭐⭐⭐⭐⭐ |
| **ContactList** | 通讯录列表 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **ContactBreadcrumb** | 面包屑导航 | ⭐⭐ | ⭐⭐⭐⭐ |

### 🎨 使用示例

#### ContactList - 通讯录列表

```vue
<!-- ✅ 零配置：使用默认样式 -->
<ContactList 
  :departments="departments"
  :users="users"
/>

<!-- ⚡ 按需配置：自定义显示 -->
<ContactList 
  :departments="departments"
  :users="users"
  :show-user-list="true"
  :show-child-count="true"
  :user-list-text="'部门成员'"
  :empty-text="'暂无数据'"
  @department-click="handleDeptClick"
  @user-click="handleUserClick"
/>

<!-- 🔧 高级配置：完全自定义 -->
<ContactList 
  :departments="departments"
  :users="users"
  :department-icon="'/custom/dept-icon.png'"
  :arrow-icon="'/custom/arrow.png'"
  :phone-icon="'/custom/phone.png'"
>
  <!-- 自定义插槽 -->
  <template #avatar="{ item }">
    <CustomAvatar :user="item" />
  </template>
</ContactList>
```

#### ContactBreadcrumb - 面包屑导航

```vue
<!-- ✅ 零配置：自动导航 -->
<ContactBreadcrumb 
  v-model="currentId"
  @change="handleChange"
/>

<!-- ⚡ 按需配置：自定义行为 -->
<ContactBreadcrumb 
  v-model="currentId"
  :max-items="5"
  @change="handleChange"
/>
```

## ⚙️ 组件配置

### ContactList 配置选项

```typescript
interface Props {
  /** 部门列表 */
  departments?: ContactDepartment[]
  /** 用户列表 */
  users?: ContactUser[]
  /** 是否显示用户列表 */
  showUserList?: boolean
  /** 是否显示子部门数量 */
  showChildCount?: boolean
  /** 用户列表标题 */
  userListText?: string
  /** 空状态文本 */
  emptyText?: string
  /** 部门图标 */
  departmentIcon?: string
  /** 箭头图标 */
  arrowIcon?: string
  /** 电话图标 */
  phoneIcon?: string
  /** 是否加载中 */
  loading?: boolean
}
```

### ContactBreadcrumb 配置选项

```typescript
interface Props {
  /** 当前层级ID */
  modelValue: number
  /** 当前部门信息 */
  currentDept?: any
  /** 最大显示数量 */
  maxItems?: number
}
```

## 🎨 样式定制

### 🎯 主题色

```scss
.contact-page {
  // 默认主题色
  --primary-color: #1890ff;
  --text-color: #333;
  --border-color: #ddd;
  --bg-color: #f5f5f5;
}
```

### 📱 响应式设计

所有组件都支持响应式设计，自动适配不同屏幕尺寸。

## 📚 使用场景

### 🟢 新手项目

```vue
<!-- 只需要这样 -->
<template>
  <ContactList 
    :departments="departments"
    :users="users"
  />
</template>
```

### 🟡 进阶项目

```vue
<!-- 按需添加功能 -->
<template>
  <ContactList 
    :departments="departments"
    :users="users"
    :show-child-count="true"
    :user-list-text="'团队成员'"
  />
</template>
```

### 🔴 复杂项目

```vue
<!-- 完全自定义 -->
<template>
  <ContactList 
    :departments="departments"
    :users="users"
    :department-icon="customIcon"
    :arrow-icon="customArrow"
    @department-click="handleDeptClick"
  >
    <template #avatar="{ item }">
      <CustomAvatar :item="item" />
    </template>
  </ContactList>
</template>
```

## 🔍 事件处理

### ContactList 事件

```typescript
// 部门点击
@department-click="handleDeptClick"

// 用户点击
@user-click="handleUserClick"

// 使用示例
function handleDeptClick(dept: ContactDepartment) {
  console.log('点击部门:', dept.name)
  // 导航到子部门
  navigateToSubDept(dept.id)
}

function handleUserClick(user: ContactUser) {
  console.log('点击用户:', user.displayName)
  // 拨打电话
  makePhoneCall(user.mobile)
}
```

### ContactBreadcrumb 事件

```typescript
// 层级变化
@change="handleChange"

// 使用示例
function handleChange(item: ContactBreadcrumbItem, index: number) {
  console.log('导航到:', item.name, '第', index, '层')
  // 加载对应层级的数据
  loadDeptData(item.id)
}
```

## 📝 常见问题

#### Q: 如何自定义头像显示？
A: 使用 `avatar` 插槽或提供 `avatar` 属性。

#### Q: 如何禁用用户列表显示？
A: 设置 `showUserList: false`。

#### Q: 如何自定义图标？
A: 使用 `departmentIcon`、`arrowIcon`、`phoneIcon` 属性。

#### Q: 如何处理空状态？
A: 组件会自动显示空状态，可通过 `emptyText` 自定义文本。

## 🎯 最佳实践

### ✅ 推荐做法

1. **从简单开始** - 先使用零配置版本
2. **按需配置** - 需要时再添加配置
3. **保持一致** - 遵循统一的命名规范
4. **渐进增强** - 逐步添加复杂功能

### ❌ 避免做法

1. **过度配置** - 不要一开始就使用复杂配置
2. **硬编码样式** - 使用配置属性而非硬编码
3. **忽略默认值** - 充分利用智能默认值
4. **重复造轮子** - 使用现有组件和插槽

## 📞 技术支持

如有问题或建议，请通过以下方式联系：

- 📧 邮箱：support@jinghe-sanjiaoroad-app.com
- 🐛 问题反馈：[GitHub Issues](https://github.com/jinghe-sanjiaoroad-app/issues)
- 📖 文档：[完整文档](https://docs.jinghe-sanjiaoroad-app.com)

---

**让通讯录开发变得简单而强大！** 🚀
