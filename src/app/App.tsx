import React, { useState } from "react";
import { CssBaseline } from "@mui/material";

import ThemeProvider from "app/context/ThemeProvider";
import AppProvider from "app/context/AppProvider";
import { IS_DEV } from "app/config/appConfig";
import useAppInit from "app/shared/hooks/useAppInit";
import Main from "./Main";

function App() {
    const [appInit, setAppInit] = useState(null);
    useAppInit(IS_DEV, setAppInit); // Custom hook to handle app initialization

    if (!appInit) return null; // Loading or initialization check

    return (
        <ThemeProvider>
            <AppProvider
                isInitialized={appInit !== null}
                hostname={window.env.VITE_QLIK_HOST_NAME}
                vp={appInit?.vp}
                qApps={appInit?.qApps}
                defaultPage={appInit?.defaultPage}
                pages={appInit?.pages}
                hasWrongConfiguration={appInit?.hasWrongConfiguration}>
                <CssBaseline />
                <Main />
            </AppProvider>
        </ThemeProvider>
    );
}

export default App;
