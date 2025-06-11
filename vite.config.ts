import postgresPlugin from "@neondatabase/vite-plugin-postgres";
import tailwindcss from "@tailwindcss/vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    entries: ["src/**/*.tsx", "src/**/*.ts"],
  },
  server: {
    warmup: {
      clientFiles: ["./src/server.tsx"],
    },
  },
  plugins: [
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    postgresPlugin({
      // env: ".env.local", // Path to your .env file (default: ".env")
      // envKey: "DATABASE_URL", // Name of the env variable (default: "DATABASE_URL")
    }),
    tailwindcss(),
    tanstackStart({
      tsr: {
        routeToken: "layout",
      },
    }),
  ],
});
