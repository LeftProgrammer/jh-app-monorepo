import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'JhApp',
      fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`,
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
        '@dcloudio/uni-app'
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
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
