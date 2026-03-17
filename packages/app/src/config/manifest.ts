/**
 * 应用配置
 *
 * @description 提供 uni-app manifest.json 的基础配置
 * @export manifestConfig - 应用配置对象
 * @usage 外部项目可基于此配置进行自定义扩展
 */

// 基础配置
export const manifestConfig = {
  'description': 'jinghe-sanjiaoroad App 移动端开发框架',
  'versionName': '1.0.0',
  'versionCode': '100',
  'name': 'jinghe-sanjiaoroad App Framework', // 默认名称，外部可覆盖
  'appid': '', // 默认为空，外部必须设置
  'locale': 'zh-Hans',

  'h5': {
    router: {
      base: '/',
    },
  },

  'app-plus': {
    usingComponents: true,
    nvueStyleCompiler: 'uni-app' as any, // 修复类型问题
    compilerVersion: 3,
    compatible: {
      ignoreVersion: true,
    },
    splashscreen: {
      alwaysShowBeforeRender: true,
      waiting: true,
      autoclose: true,
      delay: 0,
    },
    modules: {},
    distribute: {
      android: {
        minSdkVersion: 21,
        targetSdkVersion: 30,
        abiFilters: ['armeabi-v7a', 'arm64-v8a'],
        permissions: [
          '<uses-permission android:name="android.permission.INTERNET"/>',
          '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>',
          '<uses-permission android:name="android.permission.CAMERA"/>',
          '<uses-permission android:name="android.permission.VIBRATE"/>',
          '<uses-permission android:name="android.permission.CALL_PHONE"/>',
          '<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS"/>',
          '<uses-permission android:name="android.permission.READ_LOGS"/>',
          '<uses-permission android:name="android.permission.GET_ACCOUNTS"/>',
          '<uses-permission android:name="android.permission.READ_PHONE_STATE"/>',
          '<uses-permission android:name="android.permission.CHANGE_WIFI_STATE"/>',
          '<uses-permission android:name="android.permission.WAKE_LOCK"/>',
          '<uses-permission android:name="android.permission.FLASHLIGHT"/>',
          '<uses-permission android:name="android.permission.WRITE_SETTINGS"/>',
          '<uses-feature android:name="android.hardware.camera.autofocus"/>',
          '<uses-feature android:name="android.hardware.camera"/>',
        ],
      },
      ios: {},
      sdkConfigs: {},
      icons: {
        android: {
          hdpi: 'static/app/icons/72x72.png',
          xhdpi: 'static/app/icons/96x96.png',
          xxhdpi: 'static/app/icons/144x144.png',
          xxxhdpi: 'static/app/icons/192x192.png',
        },
        ios: {
          appstore: 'static/app/icons/1024x1024.png',
          ipad: {
            'app': 'static/app/icons/76x76.png',
            'app@2x': 'static/app/icons/152x152.png',
            'notification': 'static/app/icons/20x20.png',
            'notification@2x': 'static/app/icons/40x40.png',
            'proapp@2x': 'static/app/icons/167x167.png',
            'settings': 'static/app/icons/29x29.png',
            'settings@2x': 'static/app/icons/58x58.png',
            'spotlight': 'static/app/icons/40x40.png',
            'spotlight@2x': 'static/app/icons/80x80.png',
          },
          iphone: {
            'app@2x': 'static/app/icons/120x120.png',
            'app@3x': 'static/app/icons/180x180.png',
            'notification@2x': 'static/app/icons/40x40.png',
            'notification@3x': 'static/app/icons/60x60.png',
            'settings@2x': 'static/app/icons/58x58.png',
            'settings@3x': 'static/app/icons/87x87.png',
            'spotlight@2x': 'static/app/icons/80x80.png',
            'spotlight@3x': 'static/app/icons/120x120.png',
          },
        },
      },
    },
  },

  'quickapp': {},

  'mp-weixin': {
    appid: '', // 外部项目需要设置
    setting: {
      urlCheck: false,
      es6: true,
      minified: true,
    },
    optimization: {
      subPackages: true,
    },
    mergeVirtualHostAttributes: true,
    usingComponents: true,
  },

  'mp-alipay': {
    usingComponents: true,
    styleIsolation: 'shared',
    optimization: {
      subPackages: true,
    },
    compileOptions: {
      globalObjectMode: 'enable',
      transpile: {
        script: {
          ignore: ['node_modules/**'],
        },
      },
    },
  },

  'mp-baidu': {
    usingComponents: true,
  },

  'mp-toutiao': {
    usingComponents: true,
  },

  'uniStatistics': {
    enable: false,
  },

  'vueVersion': '3',
}

// 导出说明：
// manifestConfig - 基础配置对象，用于外部自定义扩展
// 使用方式：
// import { manifestConfig } from '@jinghe-sanjiaoroad-app/framework/config'
// import { defineManifestConfig } from "@uni-helper/vite-plugin-uni-manifest"
//
// export default defineManifestConfig({
//   ...manifestConfig,
//   name: '我的应用',
//   appid: 'com.myapp'
// })
