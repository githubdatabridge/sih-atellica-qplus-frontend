import React from "react";
import ReactDOM from "react-dom/client";

import App from "./app/App";
import RouterWrapper from "./app/RouterWrapper";
import "./styles.css";

(async function () {
    const filePath = import.meta.env.DEV ? "/config.development.json" : "/config.json";
    const response = await fetch(filePath);
    const config: RuntimeEnvs = await response.json();
    window.env = config;
})()
    .then(() => {
        const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
        root.render(
            <RouterWrapper>
                <App />
            </RouterWrapper>
        );
    })
    .catch(error => {
        console.error("Error", error);
    });
