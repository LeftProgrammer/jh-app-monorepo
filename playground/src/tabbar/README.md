# tabbar 说明

## 目录结构

```
tabbar/
├── config.ts    # 配置：defineTabbar() 一步完成
├── index.vue    # 组件入口（可扩展项目特有逻辑）
└── README.md    # 本文件
```

## 使用流程

框架已封装所有 tabbar 逻辑，项目只需 2 步：

### 1. 配置 — `config.ts`

调用 `defineTabbar()` 传入 tabbar 列表和回调即可，内部自动注册。

该文件同时被 `pages.config.ts`（构建时）和 `index.vue`（运行时）引用，build-time safe。

### 2. 组件 — `index.vue` → `App.ku.vue`

`index.vue` 通过 `import './config'` 触发配置注册，再渲染 `<jh-tabbar />`。
在 `App.ku.vue` 中以 `<FgTabbar />` 条件渲染。
如需项目特有的定制逻辑（动画、权限等），在 `index.vue` 中扩展即可。

> **`main.ts` 无需任何 tabbar 代码。**

## 4 种策略

| 值 | 名称 | 缓存 | 说明 |
|----|------|------|------|
| 0 | `NO_TABBAR` | - | 无 tabbar，常用于临时活动页 |
| 1 | `NATIVE_TABBAR` | 有 | 原生 tabbar（switchTab），最先渲染，但只能用图片切换 |
| 2 | `CUSTOM_TABBAR_WITH_CACHE` | 有 | 自定义 tabbar + switchTab 缓存，推荐 |
| 3 | `CUSTOM_TABBAR_WITHOUT_CACHE` | 无 | 自定义 tabbar + navigateTo，无缓存 |

## 配置说明

- **原生 tabbar** — 配置 `nativeTabbarList`，每项需 `pagePath`、`text`、`iconPath`、`selectedIconPath`
- **自定义 tabbar** — 配置 `customTabbarList`，每项需 `pagePath`、`text`、`icon`、`iconType`

## 自定义 tabbar 图标类型

### uiLib（wot-design-uni）

```js
{ iconType: 'uiLib', icon: 'home' }
```

### unocss

```js
// 需要在 uno.config.ts 的 safelist 中添加图标类名
{ iconType: 'unocss', icon: 'i-carbon-code' }
```

图标可到 https://icon-sets.iconify.design/carbon/ 选择。

### iconfont

```js
// 需要额外加上 'iconfont' 前缀
{ iconType: 'iconfont', icon: 'iconfont icon-my' }
```

### image（不推荐）

```js
// 需要配置 icon + iconActive 2 张图片
{ iconType: 'image', icon: '/static/tabbar/home.png', iconActive: '/static/tabbar/homeHL.png' }
```
