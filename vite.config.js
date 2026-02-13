import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
  server: {
    proxy: {
      '/api/analyze': {
        target: 'https://kanana-o.a2s-endpoint.kr-central-2.kakaocloud.com/v1/chat/completions',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/analyze/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Note: Since we moved API Key to server-side, for local dev we need to add it here or use the function logic locally via wrangler.
            // However, a simple proxy won't inject the Authorization header easily unless we add it here.
            // For now, let's rely on the deployed function for the full test, or add the header here if user tests locally.
            // But user is deploying.
            proxyReq.setHeader('Authorization', 'Bearer KC_IS_yDMcsmjvBNHuPt7BZyUVooP0NQnZGUCqxHB2wyvX6xWHCdPxJV2RHHVAAE7044YH');
          });
        }
      }
    }
  }
})
