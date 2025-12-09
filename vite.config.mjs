import { defineConfig } from "vite";
import dns from "dns";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import fs from "fs";
// import mkcert from "vite-plugin-mkcert";

dns.setDefaultResultOrder("verbatim");

export default defineConfig({
    base: "/",
    plugins: [react(), tsconfigPaths()],
    build: {
        outDir: "build"
    },
    server: {
        port: 7001,
        open: true,
        host: "localhost",
        https: {
            key: fs.readFileSync("./cert/localhost.key"),
            cert: fs.readFileSync("./cert/localhost.crt")
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
    
});
