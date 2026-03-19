import { tabBar } from '../components/jh-tabbar/config'

/**
 * 页面配置
 *
 * @description 提供 uni-app pages.json 的基础配置
 * @export pagesConfig - 页面配置对象
 * @usage 外部项目可基于此配置进行自定义扩展
 */
export const pagesConfig: any = {
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: 'jinghe-sanjiaoroad App 框架',
    navigationBarBackgroundColor: '#f8f8f8',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^fg-(.*)': '@/components/fg-$1/fg-$1.vue',
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  tabBar: tabBar as any,
}
