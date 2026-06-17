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
    build: {
      rollupOptions: {
        output: {
          // 重い 3D ランタイムをページ固有コードから分離し、キャッシュを効きやすくする。
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('/three/')) return 'three';
            if (id.includes('/gsap/')) return 'animation';
            if (id.includes('/react/') || id.includes('/react-dom/')) return 'react';
            return 'vendor';
          },
        },
      },
    },
  },
});
