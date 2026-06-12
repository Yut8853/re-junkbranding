import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // canonical URL・OGP・sitemap の絶対 URL の基準になる本番ドメイン。
  site: 'https://junkbranding.com',
  integrations: [react(), sitemap()],
  server: {
    host: '127.0.0.1',
    port: 4321,
  },
  vite: {
    // GLSL ファイルは `?raw` サフィックスでプレーン文字列として import する。
    assetsInclude: ['**/*.glsl'],
  },
});
