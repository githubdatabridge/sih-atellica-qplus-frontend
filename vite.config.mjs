import { defineConfig, loadEnv } from "vite";
import dns from "dns";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import fs from "fs";
import { createRequire } from "module";

dns.setDefaultResultOrder("verbatim");

// Read version from package.json
const require = createRequire(import.meta.url);
const packageJson = require("./package.json");

// Local development defaults
const DEFAULTS = {
  HOST: "local.databridge.ch",
  PORT: 7005,
  SSL_CRT_FILE: "../certificates/server/server.crt",
  SSL_KEY_FILE: "../certificates/server/server.key"
};

export default defineConfig(({ mode }) => {
  // Load environment variables for the current mode
  const env = loadEnv(mode, process.cwd(), '');

  const host = env.HOST || DEFAULTS.HOST;
  const port = env.PORT ? parseInt(env.PORT) : DEFAULTS.PORT;
  const sslCert = env.SSL_CRT_FILE || DEFAULTS.SSL_CRT_FILE;
  const sslKey = env.SSL_KEY_FILE || DEFAULTS.SSL_KEY_FILE;
  // Disable auto-open in Docker (HOST=0.0.0.0)
  const isDocker = host === "0.0.0.0";

  return {
    base: "/",
    plugins: [react(), tsconfigPaths()],
    build: {
      outDir: "build"
    },
    server: {
      port,
      open: !isDocker,
      host,
      https: {
        key: fs.readFileSync(sslKey),
        cert: fs.readFileSync(sslCert)
      }
    },
    define: {
      global: "window",
      "import.meta.env.VITE_APP_VERSION": JSON.stringify(packageJson.version)
    },
    optimizeDeps: {
      include: [
        '@emotion/react',
        '@emotion/styled',
        '@mui/material/Tooltip'
      ],
    },
  };
});