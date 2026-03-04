const modules = import.meta.glob("../pages/**/*.{vue,tsx}");

/**
 * 注册一个异步组件
 * @param componentPath 例:/bpm/oa/leave/detail
 */
export const registerComponent = (componentPath: string) => {
  for (const item in modules) {
    if (item.includes(componentPath)) {
      return defineAsyncComponent(modules[item]);
    }
  }
};
