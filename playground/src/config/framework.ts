/**
 * 框架配置模块
 *
 * @description 项目级框架配置透传
 *              由于 vite alias 将 @jinghe-sanjiaoroad-app/framework 指向本地源码
 *              TypeScript 无法正确解析子路径,这里使用 @ts-expect-error 忽略类型错误
 */

// @ts-expect-error vite alias 会在运行时正确解析路径
export { initFramework } from '@jinghe-sanjiaoroad-app/framework'

// @ts-expect-error vite alias 会在运行时正确解析路径
export { isDoubleTokenMode } from '@jinghe-sanjiaoroad-app/framework/config/framework'
