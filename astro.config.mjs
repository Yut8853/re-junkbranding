import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  server: {
    host: '127.0.0.1',
    port: 4321,
  },
  vite: {
    // GLSL files are imported via the `?raw` suffix as plain strings.
    assetsInclude: ['**/*.glsl'],
  },
});
