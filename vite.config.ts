import tailwindcss from "@tailwindcss/vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),

    tailwindcss(),
    // tailwindcss(), sentry(), ...
    tanstackStart({
      tsr: {
        routeToken: "layout",
      },
    }),
  ],
});

// export default wrapVinxiConfigWithSentry(config, {
//   org: process.env.VITE_SENTRY_ORG,
//   project: process.env.VITE_SENTRY_PROJECT,
//   authToken: process.env.SENTRY_AUTH_TOKEN,
//   // Only print logs for uploading source maps in CI
//   // Set to `true` to suppress logs
//   silent: !process.env.CI,
// });
