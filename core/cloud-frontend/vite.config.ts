import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => {
  const isAnalyze = mode === "analyze";

  return {
    base: mode === "pages" ? "./" : "/",
    plugins: [
      react(),
      tsconfigPaths(),
      ...(isAnalyze
        ? [
            visualizer({
              filename: "./dist/stats.html",
              open: true,
              gzipSize: true,
              brotliSize: true,
            }),
          ]
        : []),
    ],
    server: {
      host: "127.0.0.1",
      strictPort: true,
      proxy: {
        "/api": {
          target: process.env.DEMO_API_TARGET ?? "http://127.0.0.1:8000",
          changeOrigin: false,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/@ag-grid-community")) {
              return "vendor-ag-grid-community";
            }
            if (id.includes("node_modules/@ag-grid-enterprise")) {
              return "vendor-ag-grid-enterprise";
            }
            if (id.includes("node_modules/@echarts")) {
              return "vendor-echarts";
            }
            if (id.includes("node_modules/ag-charts-community")) {
              return "vendor-ag-charts-community";
            }
            if (id.includes("node_modules")) {
              return "vendor";
            }

            return null;
          },
        },
      },
    },
  };
});
