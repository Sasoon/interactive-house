import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  publicDir: 'node_modules/three/examples',
  resolve: {
    alias: {
      'three': path.resolve('./node_modules/three'),
    }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: 'index.html'
    }
  }
});
