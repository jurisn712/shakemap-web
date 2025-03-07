import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Указывает относительный путь для статики
  server: {
    port: 5173, // Локальный порт для разработки
  },
  build: {
    outDir: 'dist', // Папка для билда
  },
});
