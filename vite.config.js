import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // base: '/SKP-financial-ledger/',
  css: {
    preprocessorOptions: {
      css: {
        additionalData: `@import "@fullcalendar/core/main.css"; @import "@fullcalendar/daygrid/main.css";`,
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001/user",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },  
  }, optimizeDeps: {
    include: ['@fullcalendar/daygrid']
    }

});
 

