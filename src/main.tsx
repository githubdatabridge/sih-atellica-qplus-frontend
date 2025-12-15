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
        const filePath = import.meta.env.DEV ? "/config.development.json" : "/config.json";
        const response = await fetch(filePath);
        const config: RuntimeEnvs = await response.json();
        window.env = config;
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
