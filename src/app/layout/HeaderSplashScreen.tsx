import React from "react";
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";

import SvgLogo from "assets/icons/logo.svg";

const HeaderSplashScreen = () => {
  const { classes } = useStyles();

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar disableGutters className={classes.toolbar}>
        <Box flexGrow={0} mt={1} mr={6}>
          <img
            src={SvgLogo}
            alt="Logo"
            style={{ height: "2.5rem", width: "8.125rem" }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const useStyles = makeStyles()((theme: Theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    height: 72,
    backgroundColor: theme.palette.background.paper,
    boxShadow: "inset 0 -1px 0 0 #EBEBEB",
  },
  toolbar: {
    paddingLeft: theme.spacing(3),
    minHeight: 72,
  },
  logo: {
    width: 140,
    height: 55,
  },
}));

export default HeaderSplashScreen;
