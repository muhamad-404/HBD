import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// GitHub Pages serves this app at: https://muhamad-404.github.io/HBD/
// Local dev uses base "/" — GitHub Actions sets GITHUB_PAGES=true for production builds.
export default defineConfig({
  base:
    process.env.GITHUB_PAGES === 'true'
      ? '/HBD/'
      : '/',
  plugins: [vue()],
})
