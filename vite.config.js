import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: Number(process.env.PORT) || 5173 },
  resolve: { dedupe: ['react', 'react-dom'] },
  // Pre-bundle everything up front so lazily loaded pages never trigger a
  // mid-session re-optimisation (which can load two copies of React).
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'gsap',
      'gsap/ScrollTrigger',
      '@gsap/react',
      'chart.js',
      'react-chartjs-2',
      'leaflet',
      'react-leaflet',
    ],
  },
  // No manualChunks: Leaflet and Chart.js are only reached through lazy
  // imports, so Rollup keeps them out of the initial bundle on its own.
  build: { chunkSizeWarningLimit: 700 },
});
