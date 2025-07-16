import postgresPlugin from "@neondatabase/vite-plugin-postgres";
import tailwindcss from "@tailwindcss/vite";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react-oxc";
import dotenv from "dotenv";

dotenv.config();

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
    		viteReact(),
    postgresPlugin({
      // env: ".env.local", // Path to your .env file (default: ".env")
      // envKey: "DATABASE_URL", // Name of the env variable (default: "DATABASE_URL")
    }),
    tailwindcss(),
    tanstackStart({
      tsr: {
        routeToken: "layout",
      },
      spa: {
        enabled: true,
      },
 		    customViteReactPlugin: true,

    }),
    sentryVitePlugin({
      org: process.env.VITE_SENTRY_ORG,
      project: process.env.VITE_SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      // Only print logs for uploading source maps in CI
      // Set to `true` to suppress logs
      // silent: !process.env.CI,
      // disable: process.env.NODE_ENV === "development",
    }),
  ],
});
