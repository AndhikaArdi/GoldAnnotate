import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { defineConfig } from "vite";
import { fileURLToPath } from "url";

import path from "path";
import { Route, Routes } from "react-router";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@apis": path.resolve(__dirname, "./src/utils/apis"),
      "@hooks": path.resolve(__dirname, "./src/utils/hooks"),
      "@helpers": path.resolve(__dirname, "./src/utils/helpers"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@goldset_form": path.resolve(__dirname, "./src/pages/goldset-form"),
      "@components": path.resolve(__dirname, "./src/pages/layout/components"),
    },
  },
});
