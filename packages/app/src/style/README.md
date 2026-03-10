# 样式模块使用指南

## 文件结构

```
src/style/
├── index.ts          # 样式模块导出
├── index.scss        # 全局样式文件
├── uni.scss          # uni-app 样式变量（包内默认配置）
├── iconfont.css      # 图标字体样式
└── README.md         # 使用指南
```

## 设计理念

### ✅ 包项目提供默认配置
- `uni.scss` 位于包项目的 `style/` 目录下
- 提供完整的默认样式变量配置
- 所有变量使用 `!default` 标记，允许覆盖

### ✅ 使用者可以灵活覆盖
- 使用者在自己的项目中创建 `uni.scss`
- 可以选择性覆盖任何变量
- 保持与 uni-app 标准流程一致

## 使用方式

### 1. 包项目内部使用

导入样式模块自动应用所有样式：

```typescript
// 导入样式模块（自动导入 uni.scss 和 index.scss）
import '@/style'
```

### 2. 使用者项目覆盖

**在使用者项目中创建 uni.scss：**
```scss
// 使用者项目的 uni.scss
// 覆盖主题色
$uni-color-primary: #ff6b35;
$jinghe-sanjiaoroad-app-primary: #ff6b35;

// 覆盖间距
$jinghe-sanjiaoroad-app-spacing-md: 32rpx;

// 其他自定义配置...
```

### 3. 在 SCSS 中使用变量

```scss
.my-component {
  // 使用 uni-app 标准变量
  color: $uni-color-primary;
  font-size: $uni-font-size-base;
  padding: $uni-spacing-row-base;
  
  // 使用 jinghe-sanjiaoroad App 扩展变量
  background: $jinghe-sanjiaoroad-app-primary;
  margin: $jinghe-sanjiaoroad-app-spacing-md;
  border-radius: $jinghe-sanjiaoroad-app-radius-lg;
}
```

### 4. 使用工具类

```html
<template>
  <view class="yd-page-container">
    <text class="text-ellipsis">文本截断</text>
  </view>
</template>
```

## 变量系统

### uni-app 标准变量
- `$uni-color-*` - 颜色相关
- `$uni-font-size-*` - 字体大小
- `$uni-spacing-*` - 间距
- `$uni-border-radius-*` - 圆角

### jinghe-sanjiaoroad App 框架扩展变量
- `$jinghe-sanjiaoroad-app-primary` - 主题色
- `$jinghe-sanjiaoroad-app-spacing-*` - 框架间距系统（rpx 单位）
- `$jinghe-sanjiaoroad-app-radius-*` - 框架圆角系统（rpx 单位）

## 优势

### 1. **开箱即用**
- 包项目提供完整的默认配置
- 无需额外配置即可使用

### 2. **灵活定制**
- 使用者可以覆盖任何变量
- 支持增量定制，不需要完整复制

### 3. **标准兼容**
- 遵循 uni-app 的标准流程
- 与现有项目无缝集成

### 4. **类型安全**
- TypeScript 支持
- 变量名自动补全

## 最佳实践

1. **优先覆盖**：在使用者项目中覆盖变量，而不是修改包源码
2. **增量定制**：只覆盖需要修改的变量
3. **保持一致**：遵循框架的命名规范
4. **版本管理**：关注包版本更新，及时同步新的变量定义
