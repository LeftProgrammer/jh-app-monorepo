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
        // 只为入口文件生成类型声明，减少 dist 文件数量
        include: [
          'src/index.ts',
          'src/utils/index.ts',
          'src/store/index.ts',
          'src/http/index.ts',
          'src/hooks/index.ts',
          'src/components/index.ts',
          'src/router/index.ts',
          'src/vite-plugins/index.ts',
        ],
        exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'src/pages/**/*', 'src/api/**/*'],
        rollupTypes: false,
        // 禁用 source map，减少文件数量
        declarationMap: false,
      }),
    ],
    build: {
      lib: {
        entry: {
          'index': resolve(__dirname, 'src/index.ts'),
          'components/index': resolve(__dirname, 'src/components/index.ts'),
          'store/index': resolve(__dirname, 'src/store/index.ts'),
          'http/index': resolve(__dirname, 'src/http/index.ts'),
          'utils/index': resolve(__dirname, 'src/utils/index.ts'),
          'hooks/index': resolve(__dirname, 'src/hooks/index.ts'),
          'vite-plugins/index': resolve(__dirname, 'src/vite-plugins/index.ts'),
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
        external: (id) => {
          // 外部化 pages/ 目录下的所有页面组件，避免被打包进库
          if (
            id.includes('/src/pages/')
            || id.includes('\\src\\pages\\')
            || (/[/\\]pages[/\\]/.test(id) && (id.endsWith('.vue') || id.endsWith('.ts')))
          ) {
            return true
          }
          // 其余走字符串/正则匹配
          const externals: (string | RegExp)[] = [
            'vue',
            'pinia',
            'vue-router',
            'vue-i18n',
            'dayjs',
            'crypto-js',
            'jsencrypt',
            '@dcloudio/uni-app',
            '@dcloudio/uni-components',
            '@dcloudio/uni-h5',
            '@dcloudio/uni-mp-weixin',
            'wot-design-uni',
            'bpmn-js',
            'bpmn-js-token-simulation',
            'diagram-js',
            'min-dash',
            'axios',
            'pinia-plugin-persistedstate',
            'js-cookie',
            'lodash-es',
            'z-paging',
            /^@/,
            /^[a-z]/,
            /^node:/,
          ]
          return externals.some(e => typeof e === 'string' ? id === e : e.test(id))
        },
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
    // 确保外部化时正确处理别名路径
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  }
})
