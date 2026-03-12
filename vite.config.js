import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'void-elements': path.resolve(__dirname, 'src/shims/void-elements.js'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'i18next',
      'react-i18next',
      'framer-motion',
      'react-markdown',
      'remark-gfm',
    ],
    exclude: ['html-parse-stringify'],
  },
  server: {
    port: 5173,
    strictPort: false,
    // Tắt HMR để tránh lỗi WebSocket khi kết nối ws:// thất bại (firewall/proxy). Sửa code xong refresh trang.
    hmr: false,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false,
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Di sản Văn hóa Cà Mau',
        short_name: 'Di sản Cà Mau',
        description: 'Cổng thông tin di sản văn hóa tỉnh Cà Mau',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        // QUAN TRỌNG: Chỉ cache các file tĩnh thông thường
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
        
        // Bỏ qua các file trong thư mục audio khi điều hướng
        navigateFallbackDenylist: [/^\/audio\//],
        
        // Cấu hình chiến lược cache:
        // File âm thanh (.wav, .mp3) sẽ dùng NetworkOnly (không cache) để tránh lỗi 206
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/audio/') || /\.(wav|mp3)$/i.test(url.pathname),
            handler: 'NetworkOnly',
          },
          {
            // Cache hình ảnh (CacheFirst)
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 ngày
              },
            },
          },
          {
            // Cache Font chữ, CSS, JS (StaleWhileRevalidate)
            urlPattern: ({ request }) => 
              request.destination === 'script' ||
              request.destination === 'style' || 
              request.destination === 'font',
            handler: 'StaleWhileRevalidate',
          }
        ]
      }
    })
  ],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          mapbox: ['mapbox-gl'],
          vendor: ['react', 'react-dom', 'react-router-dom', 'react-i18next', 'i18next'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
