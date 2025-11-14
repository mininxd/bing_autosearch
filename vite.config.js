import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import packages from './package.json'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  define: {
    APP_VER: JSON.stringify(packages.version),
  },
})