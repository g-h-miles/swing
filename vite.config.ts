import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),viteReact({
      babel: {
        plugins: [jotaiDebugLabel, jotaiReactRefresh]
      }
      // babel: {
      //   plugins: [["babel-plugin-react-compiler", {target: "19"}]]
      // }
    }), tailwindcss(), mkcert(), tsconfigPaths()],
});
