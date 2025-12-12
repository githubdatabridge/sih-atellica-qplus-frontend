import { defineConfig, loadEnv } from "vite";
import dns from "dns";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import fs from "fs";

dns.setDefaultResultOrder("verbatim");

export default defineConfig(({ mode }) => {
  // Load environment variables for the current mode
  // The third argument ('') is the prefix; an empty string loads all variables.
  // By default, it only loads variables prefixed with 'VITE_'
  const env = loadEnv(mode, process.cwd(), '');

  return {
   base: "/",
    plugins: [react(), tsconfigPaths()],
    build: {
        outDir: "build"
    },
    server: {
        port: env.PORT ? parseInt(env.PORT) : 7000,
        open: true,
        host: env.HOST || "localhost",
        https: {
            key: fs.readFileSync(env.SSL_KEY_FILE || "../certificates/server/server.key"),
            cert: fs.readFileSync(env.SSL_CRT_FILE || "../certificates/server/server.crt")
        }
    },
    define: {
        global: "window"
    }
    ,optimizeDeps: {
        include: [
          '@emotion/react', 
          '@emotion/styled', 
          '@mui/material/Tooltip'
        ],
      },
  };
});