import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  return {
    plugins: [
      vue(),
      // 启用 DTS 插件，自动生成类型声明
      dts({
        insertTypesEntry: true,
        include: ['src/index.ts', 'src/components/index.ts'],
        exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
        rollupTypes: false,
      }),
    ],
    build: {
      lib: {
        entry: {
          'index': resolve(__dirname, 'src/index.ts'),
          'components/index': resolve(__dirname, 'src/components/index.ts'),
        },
        name: 'JhApp',
        formats: ['es', 'cjs'],
        fileName: (format, entryName) => {
          const extension = format === 'es' ? 'esm.js' : 'cjs.js'
          return entryName === 'index' ? `index.${extension}` : `${entryName}.${extension}`
        },
      },
      rollupOptions: {
        // 最简单有效的方案
        external: [
          // 核心依赖
          'vue',
          'pinia',
          'vue-router',
          'vue-i18n',
          'dayjs',
          'crypto-js',
          'jsencrypt',
          // UniApp 相关
          '@dcloudio/uni-app',
          '@dcloudio/uni-components',
          '@dcloudio/uni-h5',
          '@dcloudio/uni-mp-weixin',
          'wot-design-uni',
          // BPMN 相关
          'bpmn-js',
          'bpmn-js-token-simulation',
          'diagram-js',
          'min-dash',
          // 其他依赖
          'axios',
          'pinia-plugin-persistedstate',
          'js-cookie',
          'lodash-es',
          'z-paging',
          'wot-design-uni',
          // 一劳永逸 - 外部化所有第三方包
          /^@/, // 所有 @ 开头的包
          /^[a-z]/, // 所有小写字母开头的包
          'node:*', // 所有 node: 模块
          /^node:/, // 所有 node: 模块
        ],
        output: {
          globals: {
            'vue': 'Vue',
            'pinia': 'Pinia',
            'vue-router': 'VueRouter',
            'vue-i18n': 'VueI18n',
            'dayjs': 'dayjs',
            'crypto-js': 'CryptoJS',
            'jsencrypt': 'JSEncrypt',
          },
        },
      },
      cssCodeSplit: false,
      sourcemap: !isProduction,
      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          }
        : undefined,
      emptyOutDir: true,
      target: 'es2015',
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  }
})
