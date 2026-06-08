import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/ai/': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
        '/agent-api': {
          target: env.VITE_PROXY_AGENT_API_TARGET || '',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/agent-api/, ''),
        },
        '/bus': {
          target: env.VITE_PROXY_BUS_TARGET || '',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/bus/, ''),
        },
        '/iotzhibaozhan': {
          target: env.VITE_PROXY_IOTZHIBAO_TARGET || '',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/iotzhibaozhan/, ''),
        },
        '/iotshangqing': {
          target: env.VITE_PROXY_IOTSHANGQING_TARGET || '',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/iotshangqing/, ''),
        },
        '/aiScreen': {
          target: env.VITE_PROXY_AISCREEN_TARGET || '',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/aiScreen/, ''),
        },
        // 虫情相关接口
        '/adp': {
          target: env.VITE_PROXY_ADP_TARGET || '',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/adp/, ''),
        },
        // 墒情相关接口
        '/resource': {
          target: env.VITE_PROXY_RESOURCE_TARGET || '',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/resource/, ''),
        },
        '/agent-screen': {
          target: env.VITE_PROXY_AGENT_SCREEN_TARGET || '',
          changeOrigin: true,
        }
      },
    },
  }
})
