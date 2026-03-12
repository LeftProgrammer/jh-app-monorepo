import type { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

/**
 * Manifest 类型定义
 * 
 * @description UniApp Manifest 的类型定义，支持 plus 和 app-plus 配置
 */
interface ManifestType {
  /** plus 配置 */
  'plus'?: {
    distribute?: {
      plugins?: Record<string, any>
    }
  }
  /** app-plus 配置 */
  'app-plus'?: {
    distribute?: {
      plugins?: Record<string, any>
    }
  }
}

/**
 * Manifest 同步 Vite 插件
 * 
 * @description 在构建后自动同步源 Manifest 中的插件配置到目标 Manifest 文件
 * @export syncManifestPlugin - Manifest 同步插件
 * @usage Vite 构建插件、Manifest 配置同步、原生插件管理
 * 
 * @example
 * ```typescript
 * import { syncManifestPlugin } from '@jinghe-sanjiaoroad-app/framework/vite-plugins'
 * 
 * export default defineConfig({
 *   plugins: [
 *     syncManifestPlugin()
 *   ]
 * })
 * ```
 */
export default function syncManifestPlugin(): Plugin {
  return {
    name: 'sync-manifest',
    apply: 'build',
    enforce: 'post',
    writeBundle: {
      order: 'post',
      handler() {
        const srcManifestPath = path.resolve(process.cwd(), './src/manifest.json')
        const distAppPath = path.resolve(process.cwd(), './dist/dev/app/manifest.json')

        try {
          // 读取源文件
          const srcManifest = JSON.parse(fs.readFileSync(srcManifestPath, 'utf8')) as ManifestType

          // 确保目标目录存在
          const distAppDir = path.dirname(distAppPath)
          if (!fs.existsSync(distAppDir)) {
            fs.mkdirSync(distAppDir, { recursive: true })
          }

          // 读取目标文件（如果存在）
          let distManifest: ManifestType = {}
          if (fs.existsSync(distAppPath)) {
            distManifest = JSON.parse(fs.readFileSync(distAppPath, 'utf8'))
          }

          // 如果源文件存在 plugins
          if (srcManifest['app-plus']?.distribute?.plugins) {
            // 确保目标文件中有必要的对象结构
            if (!distManifest.plus)
              distManifest.plus = {}
            if (!distManifest.plus.distribute)
              distManifest.plus.distribute = {}

            // 复制 plugins 内容
            distManifest.plus.distribute.plugins = srcManifest['app-plus'].distribute.plugins

            // 写入更新后的内容
            fs.writeFileSync(distAppPath, JSON.stringify(distManifest, null, 2))
            console.log('✅ Manifest plugins 同步成功')
          }
        }
        catch (error) {
          console.error('❌ 同步 manifest plugins 失败:', error)
        }
      },
    },
  }
}
