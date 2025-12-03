import React from "react";
import ReactDOM from "react-dom/client";

import App from "./app/App";
import RouterWrapper from "./app/RouterWrapper";
import "./styles.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <RouterWrapper>
    <App />
  </RouterWrapper>
);
