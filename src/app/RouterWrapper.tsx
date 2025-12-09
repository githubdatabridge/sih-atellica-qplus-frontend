import { ReactNode } from "react";
import { BrowserRouter, HashRouter } from "react-router-dom";

type RouterWrapperProp = {
    children: ReactNode;
};

function RouterWrapper({ children }: RouterWrapperProp) {
    const isHashRouter = window.env.VITE_ROUTER === "Hash";
    return !isHashRouter ? (
        <BrowserRouter>{children}</BrowserRouter>
    ) : (
        <HashRouter>{children}</HashRouter>
    );
}

export default RouterWrapper;
