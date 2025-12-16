import React from "react";
import ReactDOM from "react-dom/client";

import App from "./app/App";
import RouterWrapper from "./app/RouterWrapper";
import "./styles.css";

// Prevent re-initialization during HMR in dev mode
let root: ReactDOM.Root | null = null;

(async function () {
    // Skip config fetch if already loaded (HMR scenario)
    if (!window.env) {
        const primaryPath = import.meta.env.DEV ? "/config.development.json" : "/config.json";
        const fallbackPath = "/config.json";

        const loadConfig = async (path: string) => {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load ${path}: ${response.status}`);
            }
            return response.json() as Promise<RuntimeEnvs>;
        };

        try {
            // Try the dev-specific file first, then fall back to shared config.
            window.env = await loadConfig(primaryPath);
        } catch (error) {
            if (import.meta.env.DEV) {
                window.env = await loadConfig(fallbackPath);
            } else {
                throw error;
            }
        }
    }
})()
    .then(() => {
        // Reuse existing root during HMR
        if (!root) {
            root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
        }
        root.render(
            <RouterWrapper>
                <App />
            </RouterWrapper>
        );
    })
    .catch(error => {
        console.error("Error", error);
    });
