// Vite 插件统一导出
export { createCopyNativeResourcesPlugin } from './copy-native-resources'
export { default as syncManifestPlugin } from './sync-manifest-plugins'

/**
 * 创建 JH App 框架的完整 Vite 插件集合
 * 
 * @param options 插件配置选项
 * @returns Vite 插件数组
 */
export function createJhAppPlugins(options: {
  copyNative?: {
    enable?: boolean
    sourceDir?: string
    targetDirName?: string
    verbose?: boolean
  }
}) {
  const plugins = []
  
  // 原生插件资源复制插件
  if (options.copyNative?.enable !== false) {
    plugins.push(
      createCopyNativeResourcesPlugin(
        options.copyNative?.enable ?? true,
        {
          sourceDir: options.copyNative?.sourceDir,
          targetDirName: options.copyNative?.targetDirName,
          verbose: options.copyNative?.verbose
        }
      )
    )
  }
  
  // Manifest 同步插件
  plugins.push(syncManifestPlugin())
  
  return plugins
}
