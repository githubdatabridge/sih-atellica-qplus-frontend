import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import List from "@mui/material/List";

import { useAppContext } from "app/context/AppContext";
import NavbarButtonLink from "./components/button/NavbarButtonLink";
import { DASHBOARD_URL_PATH } from "./constants/constants";
import { useStyles } from "./Navbar.styles";

function Navbar() {
    const { t } = useTranslation();
    const { classes } = useStyles();

    const { pages } = useAppContext();
    const [items, setItems] = useState<{ path: string; title: string }[]>([]);

    useEffect(() => {
        const menuItems = [];
        if (pages) {
            if (pages.get("compliance")) {
                menuItems.push({
                    path: `${DASHBOARD_URL_PATH}/compliance`,
                    title: t("sih-header-menu-compliance")
                });
            }
            if (pages.get("audit")) {
                menuItems.push({
                    path: `${DASHBOARD_URL_PATH}/audit`,
                    title: t("sih-header-menu-audit")
                });
            }
            if (pages.get("reporting")) {
                menuItems.push({
                    path: `${DASHBOARD_URL_PATH}/reporting`,
                    title: t("sih-header-menu-reporting")
                });
            }
        }

        setItems(menuItems);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pages]);

    if (!items || items.length === 0) return null;

    return (
        <List component="nav" className={classes.list}>
            {items.map((item, index) => (
                <div key={`navbar-item-${index}`} className={classes.listItem}>
                    <NavbarButtonLink {...item} />
                </div>
            ))}
        </List>
    );
}

export default Navbar;
