import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// Define __dirname for ES module scope
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    fs: {
      // Allow serving files from one level up to the project root
      allow: [
        // Add allow list for slick-carousel fonts
        path.resolve(__dirname, '../node_modules/slick-carousel'),
        // Keep existing allow paths
        '..',
        'src',
      ],
    },
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
  },
  optimizeDeps: {
    esbuild: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});