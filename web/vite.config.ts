import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import path from 'node:path';
export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'content-diagnostics',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = decodeURIComponent((req.url || '').split('?')[0]);
          if (
            url.startsWith('/content/') &&
            !existsSync(path.join(process.cwd(), 'public', url))
          ) {
            console.warn('Missing content:', url);
            res.statusCode = 404;
            res.end('Content not found');
            return;
          }
          next();
        });
      },
    },
  ],
  server: { host: '127.0.0.1' },
});
