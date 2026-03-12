# Config 模块使用指南

## 概述

jinghe-sanjiaoroad App 框架的配置模块，提供应用配置、页面配置和样式配置的基础设置。

## 配置文件

### manifest.ts - 应用配置

提供 uni-app `manifest.json` 的基础配置。

**导出：**
- `manifestConfig` - 应用配置对象

**外部使用：**
```typescript
// manifest.config.ts
import { manifestConfig } from '@jinghe-sanjiaoroad-app/framework/config'
import { defineManifestConfig } from "@uni-helper/vite-plugin-uni-manifest"

export default defineManifestConfig({
  ...manifestConfig,
  name: '我的应用',
  appid: 'com.myapp'
})
```

### pages.ts - 页面配置

提供 uni-app `pages.json` 的基础配置。

**导出：**
- `pagesConfig` - 页面配置对象

**外部使用：**
```typescript
// pages.config.ts
import { pagesConfig } from '@jinghe-sanjiaoroad-app/framework/config'
import { defineUniPages } from "@uni-helper/vite-plugin-uni-pages"

export default defineUniPages({
  ...pagesConfig,
  globalStyle: {
    navigationBarTitleText: '我的应用',
    navigationBarBackgroundColor: '#1890ff'
  }
})
```

### uno.ts - 样式配置

提供 UnoCSS 的基础配置。

**导出：**
- `unoConfig` - 样式配置对象

**外部使用：**
```typescript
// uno.config.ts
import { unoConfig } from '@jinghe-sanjiaoroad-app/framework/config'
import { defineConfig } from 'unocss'

export default defineConfig({
  ...unoConfig,
  theme: {
    colors: {
      primary: '#1890ff'
    }
  }
})
```

## 统一导入

所有配置可以通过统一入口导入：

```typescript
import { 
  manifestConfig,
  pagesConfig, 
  unoConfig 
} from '@jinghe-sanjiaoroad-app/framework/config'
```

## 环境变量处理

配置模块不包含环境变量处理，外部项目需要自行处理：

```typescript
import { loadEnv } from "vite"
import path from "path"

// 加载环境变量
const env = loadEnv(process.env.NODE_ENV, process.cwd())
const { VITE_APP_TITLE, VITE_UNI_APPID } = env

// 在配置中使用
export default defineManifestConfig({
  ...manifestConfig,
  name: VITE_APP_TITLE || '默认应用名',
  appid: VITE_UNI_APPID || 'com.default.app'
})
```

## 依赖说明

配置模块的依赖已安装在包内部，外部项目只需要安装核心依赖：

- `@uni-helper/vite-plugin-uni-manifest` - manifest 处理
- `@uni-helper/vite-plugin-uni-pages` - pages 处理  
- `unocss` - UnoCSS 核心

## 自定义扩展

所有配置都支持完全自定义，外部项目可以：

1. **覆盖配置项** - 直接覆盖任何配置属性
2. **添加新配置** - 添加新的配置项
3. **合并配置** - 使用对象扩展语法合并
4. **环境变量** - 根据环境动态配置

## 最佳实践

1. **使用环境变量** - 将敏感信息通过环境变量配置
2. **分层配置** - 基础配置 + 环境配置 + 项目配置
3. **类型安全** - 充分利用 TypeScript 类型检查
4. **配置验证** - 在构建时验证配置完整性

## 故障排除

### 常见问题

1. **配置不生效** - 检查是否正确导入了配置处理函数
2. **类型错误** - 确保安装了对应的核心依赖
3. **环境变量未生效** - 检查环境变量文件和加载逻辑

### 调试技巧

1. **查看最终配置** - 在构建输出中查看生成的配置文件
2. **逐步调试** - 先使用基础配置，再逐步添加自定义
3. **类型检查** - 充分利用 TypeScript 的类型提示
