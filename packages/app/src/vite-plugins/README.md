# Vite 插件模块

框架提供的 Vite 构建插件，解决 UniApp App 平台构建时的原生插件资源复制和 Manifest 同步问题。

## 模块结构

| 文件 | 导出 | 说明 |
|------|------|------|
| `copy-native-resources.ts` | `createCopyNativeResourcesPlugin` | 原生插件资源复制（`nativeplugins` → `dist`） |
| `sync-manifest-plugins.ts` | `syncManifestPlugin` | 构建后同步 `manifest.json` 中的 plugins 配置 |
| `index.ts` | 统一导出 | — |

## 导入方式

```ts
import {
  createCopyNativeResourcesPlugin,
  syncManifestPlugin,
} from '@jinghe-sanjiaoroad-app/framework/vite-plugins'
```

> 注意：此子路径在 `package.json` 中以编译后产物导出（`dist/vite-plugins/`），构建时使用。

## createCopyNativeResourcesPlugin

将项目根目录的 `nativeplugins/` 复制到构建输出目录，解决 App 平台打包后原生插件找不到的问题。

**参数：**

```ts
createCopyNativeResourcesPlugin(enable: boolean, options?: CopyNativeResourcesOptions)
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enable` | `boolean` | `true` | 是否启用 |
| `options.sourceDir` | `string` | `'nativeplugins'` | 源目录（相对项目根目录） |
| `options.targetDirName` | `string` | `'nativeplugins'` | 构建输出中的目录名 |
| `options.verbose` | `boolean` | `true` | 是否显示详细日志 |
| `options.logPrefix` | `string` | `'[copy-native-resources]'` | 日志前缀 |

**在 `vite.config.ts` 中使用：**

```ts
plugins: [
  createCopyNativeResourcesPlugin(
    UNI_PLATFORM === 'app' && VITE_COPY_NATIVE_RES_ENABLE === 'true',
    { verbose: mode === 'development' },
  ),
]
```

**环境变量配置：**

在 `env/.env` 中添加：

```bash
# 是否启用原生插件资源复制
VITE_COPY_NATIVE_RES_ENABLE = true
```

**`manifest.config.ts` 配置原生插件：**

```ts
export default defineManifest({
  'app-plus': {
    nativePlugins: {
      'HL-HHWUHFController': {
        __plugin_info__: {
          name: 'HL-HHWUHFController',
          description: 'RFID UHF 控制器插件',
          platforms: 'Android',
          isCloud: false,
          bought: -1,
          parameters: {}
        }
      }
    }
  }
})
```

**工作原理：** 在 Vite `writeBundle` 阶段，将 `nativeplugins/` 整个目录复制到构建输出目录。源目录不存在或为空时自动跳过。

**构建输出结构：**

```
dist/
├── build/app/nativeplugins/    # 生产环境
└── dev/app/nativeplugins/      # 开发环境
```

## syncManifestPlugin

构建后将 `src/manifest.json` 中 `app-plus.distribute.plugins` 配置同步到 `dist/dev/app/manifest.json` 的 `plus.distribute.plugins`。

**无参数，直接调用：**

```ts
plugins: [
  syncManifestPlugin(),
]
```

**工作原理：** 在 `writeBundle`（order: post）阶段读取源 `manifest.json`，将 `app-plus.distribute.plugins` 写入构建产物中的 `manifest.json`（`plus.distribute.plugins` 路径）。

## 常见问题

### 原生插件资源复制不生效？

1. 确认项目根目录存在 `nativeplugins/` 目录且包含插件文件
2. 确认 `VITE_COPY_NATIVE_RES_ENABLE` 设为 `true`
3. 确认当前平台为 `app`（插件仅在 app 平台有意义）
4. 开启 `verbose: true` 查看详细日志

### 原生插件权限冲突

有用户反馈接入多个原生插件时遇到以下问题：
- 多个插件内的权限配置有版本冲突，云打包最后一步报错，需修改其中一个 aar 配置版本解决
- Android 12+ 设备上，获取相册权限后打开相册看不到照片，删除插件后恢复正常，怀疑是插件的 `AndroidManifest.xml` 覆盖了 `manifest.config.ts` 中的权限声明

遇到类似问题欢迎反馈。
