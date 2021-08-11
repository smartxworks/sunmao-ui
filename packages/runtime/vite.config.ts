import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  define: {
    // https://github.com/satya164/react-simple-code-editor/issues/86
    global: "globalThis",
  },
});
