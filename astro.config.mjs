// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  experimental: {
    env: {
      schema: {
        GOOGLE_MAPS_API_KEY: envField.string({
          context: "server",
          access: "secret",
        }),
      },
    },
  },
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  adapter: node({
    mode: "standalone",
  }),
});
