import { VitePWA } from "vite-plugin-pwa";
// eslint-disable-next-line no-undef
export default defineConfig({
  plugins: [
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "my-sw.js",
    }),
  ],
});
