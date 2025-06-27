import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteReact(), tailwindcss(), mkcert(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
  },
});
