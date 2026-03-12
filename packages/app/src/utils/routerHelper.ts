/**
 * 注册一个异步组件
 * @param componentPath 组件路径片段，例: /bpm/oa/leave/detail
 * @param modules 由调用方通过 import.meta.glob 传入的模块映射
 */
export function registerComponent(
  componentPath: string,
  modules: Record<string, () => Promise<unknown>>,
) {
  for (const item in modules) {
    if (item.includes(componentPath)) {
      return defineAsyncComponent(modules[item] as Parameters<typeof defineAsyncComponent>[0])
    }
  }
}
