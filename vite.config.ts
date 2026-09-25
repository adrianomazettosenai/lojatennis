import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Garante que caminhos de assets sejam relativos para o WebView do Capacitor/Android
})
