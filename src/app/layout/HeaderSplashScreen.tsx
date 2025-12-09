import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";

import SvgLogo from "assets/icons/logo.svg";
import { useStyles } from "./HeaderSplashScreen.styles";

function HeaderSplashScreen() {
    const { classes } = useStyles();

    return (
        <AppBar position="static" className={classes.appBar}>
            <Toolbar disableGutters className={classes.toolbar}>
                <Box flexGrow={0} mt={1} mr={6}>
                    <img src={SvgLogo} alt="Logo" style={{ height: "2.5rem", width: "8.125rem" }} />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default HeaderSplashScreen;
