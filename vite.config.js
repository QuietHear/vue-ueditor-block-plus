/*
 * @Author: aFei
 * @Date: 2022-11-10 14:56:59
*/
/*
 * @LastEditors: aFei
 * @LastEditTime: 2025-03-27 13:59:10
*/
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import autoImport from "unplugin-auto-import/vite";
import * as path from 'path';

export default defineConfig(({ command, mode }) => ({
  // 打包的时候排除public目录
  publicDir: command === 'build' ? false : true,
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, './src'),
      'asset': path.resolve(__dirname, './src/assets'),
      'view': path.resolve(__dirname, './src/views'),
    }
  },
  server: {
    open: true
  },
  esbuild: {
    drop: ['console', 'debugger']
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, "./lib/index.js"),
      name: "vueUeditorBlockPlus",
      fileName: "vue-ueditor-block-plus",
    },
    rollupOptions: {
      external: ["vue", "vue-router", "element-plus"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  plugins: [vue(), vueDevTools(), autoImport({ imports: ['vue', { from: 'vue', imports: ['isVNode'] }, 'vue-router', { from: 'vue-router', imports: ['createRouter', 'createWebHistory'] }], dts: false })],
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        silenceDeprecations: ["legacy-js-api"]
      }
    }
  }
}));
