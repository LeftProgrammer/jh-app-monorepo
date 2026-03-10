/**
 * Vite 插件模块统一导出
 * 
 * @description 提供 jinghe-sanjiaoroad App 框架的 Vite 插件集合，包括原生插件资源复制、Manifest 同步等功能
 * @export createCopyNativeResourcesPlugin - 原生插件资源复制插件
 * @export syncManifestPlugin - Manifest 同步插件
 * @usage Vite 构建插件、原生插件管理、Manifest 配置同步
 */

// Vite 插件统一导出
export { createCopyNativeResourcesPlugin } from './copy-native-resources'
export { default as syncManifestPlugin } from './sync-manifest-plugins'
