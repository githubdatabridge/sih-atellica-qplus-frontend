import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import MenuIcon from "@mui/icons-material/Menu";
import { lighten, useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { QplusNotificationCenter } from "@databridge/qplus";

import { useAppContext } from "app/context/AppContext";
import SvgLogo from "assets/icons/logo.svg";
import Navbar from "./Navbar";
import SideDrawer from "./SideDrawer";
import HelpBadge from "./components/badge/HelpBadge";
import AvatarButton from "./components/button/AvatarButton";
import FilterButton from "./components/button/FilterButton";
import SettingsPopper from "./components/popper/SettingsPopper";
import { useStyles } from "./Header.styles";

function Header() {
    const { t } = useTranslation();
    const { classes } = useStyles();
    const { isHeaderVisible, selectionCount, pages } = useAppContext();
    const isTablet = useMediaQuery({ query: "(max-width: 951px)" });
    const isMobile = useMediaQuery({ query: "(max-width: 750px)" });

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    const theme = useTheme();

    const APP_VERSION = import.meta.env.VITE_APP_VERSION || "N/A";

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar disableGutters className={classes.toolbar}>
                {isTablet && (
                    <Box
                        mt={1}
                        mr={2}
                        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                        style={{ zIndex: 1301 }}>
                        <MenuIcon className={classes.burgerMenu} fontSize="large" />
                    </Box>
                )}
                <Box flexGrow={0} mt={1} mr={6} className={classes.logo}>
                    <img src={SvgLogo} alt="Logo" style={{ height: "2.5rem", width: "8.125rem" }} />
                </Box>
                {!isMobile && (
                    <Box mt={1}>
                        <Typography className={classes.title}>
                            {t("sih-header-logo-title")}
                        </Typography>
                        <Typography className={classes.version}>{APP_VERSION}</Typography>
                    </Box>
                )}
                <Box flexGrow={1} mt={1}>
                    {!isTablet && <Navbar />}
                </Box>
                <Box p={1} className={classes.empty} />
                {pages.get("reporting") && <SettingsPopper />}
                {!isHeaderVisible && selectionCount > 0 && <FilterButton />}
                <HelpBadge />
                {pages.get("reporting") && (
                    <QplusNotificationCenter
                        color="info"
                        cssNotificationIcon={{
                            color: lighten(theme.palette.primary.main, 0.5)
                        }}
                    />
                )}
                <AvatarButton />
            </Toolbar>
            {isTablet && <SideDrawer isOpen={isDrawerOpen} closeDrawer={handleDrawerClose} />}
        </AppBar>
    );
}

export default Header;
