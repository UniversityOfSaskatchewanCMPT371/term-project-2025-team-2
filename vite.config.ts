import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: "cmpt371-team2",
      project: "javascript-react",
    }),
    sentryVitePlugin({
      org: "cmpt371-team2",
      project: "javascript-react",
    }),
    sentryVitePlugin({
      org: "cmpt371-team2",
      project: "javascript",
    }),
    sentryVitePlugin({
      org: "cmpt371-team2",
      project: "javascript",
    }),
  ],

  build: {
    sourcemap: true,
  },
});
