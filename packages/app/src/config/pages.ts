import { defineUniPages } from "@uni-helper/vite-plugin-uni-pages";
import { tabBar } from "../tabbar/config";

/**
 * JH App 框架默认页面配置
 * 使用方式：
 * import { defaultPages } from '@jh-app/app/config'
 * 
 * // 在外部项目的 pages.config.ts 中：
 * import { defineUniPages } from "@uni-helper/vite-plugin-uni-pages";
 * import { defaultPages } from '@jh-app/app/config'
 * 
 * export default defineUniPages({
 *   ...defaultPages,
 *   globalStyle: {
 *     navigationBarTitleText: "我的应用",
 *   }
 * })
 */
export const defaultPages = {
  globalStyle: {
    navigationStyle: "default",
    navigationBarTitleText: "JH App 框架",
    navigationBarBackgroundColor: "#f8f8f8",
    navigationBarTextStyle: "black",
    backgroundColor: "#FFFFFF",
  },
  easycom: {
    autoscan: true,
    custom: {
      "^fg-(.*)": "@/components/fg-$1/fg-$1.vue",
      "^wd-(.*)": "wot-design-uni/components/wd-$1/wd-$1.vue",
      "^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)":
        "z-paging/components/z-paging$1/z-paging$1.vue",
    },
  },
  tabBar: tabBar as any,
};

// 导出 uni-app 页面配置
export default defineUniPages(defaultPages);
