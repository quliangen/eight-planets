import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets are loaded correctly if deployed to a subfolder
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // 框架/渲染库单独分包：业务代码改动时浏览器缓存不失效，且可并行下载。
        // 用函数形式（数组形式会让 react 被打进 three 分块，留下空壳 chunk）
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          // MediaPipe 必须排除在手动分包外，否则会被并入 vendor 失去懒加载
          if (id.includes('@mediapipe')) return;
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
          return 'vendor';
        }
      }
    }
  }
});