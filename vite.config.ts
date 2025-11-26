import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // expose process.env.API_KEY to the client build
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  preview: {
    allowedHosts: ['chefwhiskers.onrender.com']
  },
  server: {
    allowedHosts: ['chefwhiskers.onrender.com']
  }
});