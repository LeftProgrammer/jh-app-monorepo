import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'components/index': resolve(__dirname, 'src/components/index.ts'),
      },
      name: 'JhApp',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const extension = format === 'es' ? 'esm' : format;
        if (entryName === 'index') {
          return `index.${extension}.js`;
        }
        return `${entryName}.${extension}.js`;
      },
    },
    rollupOptions: {
      external: [
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
        'diagram-js',
        'bpmn-js-token-simulation',
        'abortcontroller-polyfill'
      ],
      output: {
        globals: {
          vue: 'Vue',
          pinia: 'Pinia',
          'vue-router': 'VueRouter',
          'vue-i18n': 'VueI18n',
          dayjs: 'dayjs',
          'crypto-js': 'CryptoJS',
          jsencrypt: 'JSEncrypt',
          '@dcloudio/uni-app': 'UniApp',
          '@dcloudio/uni-components': 'UniComponents',
          '@dcloudio/uni-h5': 'UniH5',
          '@dcloudio/uni-mp-weixin': 'UniMpWeixin',
          'wot-design-uni': 'WotDesignUni',
          'bpmn-js': 'BpmnJs',
          'diagram-js': 'DiagramJs',
          'bpmn-js-token-simulation': 'BpmnJsTokenSimulation',
          'abortcontroller-polyfill': 'AbortControllerPolyfill'
        },
      },
    },
    cssCodeSplit: true,
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
