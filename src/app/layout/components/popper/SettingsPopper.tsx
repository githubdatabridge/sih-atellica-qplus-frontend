import React, { FC, useEffect, useRef, useState } from "react";
import { useMount } from "react-use";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Theme } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { userService } from "@databridge/core-services";

import {
    QPLUS_KEYS,
    QplusBaseIconTooltip,
    QplusLocalStorage,
    useQplusAuthContext
} from "@databridge/qplus";

import { useAppContext } from "app/context/AppContext";
import { ROLE_PERMISSIONS, QPLUS_USER_ROLES } from "app/shared/constants/constants";
import { useStyles } from "./SettingsPopper.styles";

interface ISettingsPopper {
    mode?: string;
}

const SettingsPopper: FC<ISettingsPopper> = () => {
    const theme = useTheme<Theme>();
    const { classes } = useStyles();
    const { pathname } = useLocation();
    const { t } = useTranslation();

    const { isAdminRole, setIsAdminRole } = useAppContext();
    const { appUser } = useQplusAuthContext();

    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [, setUser] = useState<object | null>(null);
    const [, setOpenPreferences] = useState(false);
    const [color, setColor] = useState<string>(theme.palette.primary.contrastText);
    const anchorRef = useRef(null);

    useMount(async () => {
        const currentUser = await userService.getCurrentUser();
        setUser(currentUser);
    });

    useEffect(() => {
        if (appUser?.roles?.includes(QPLUS_USER_ROLES.ADMIN)) {
            QplusLocalStorage.save(QPLUS_KEYS.QPLUS_ROLE_IS_ADMIN, true);
            setIsAdminRole(true);
        } else {
            QplusLocalStorage.save(QPLUS_KEYS.QPLUS_ROLE_IS_ADMIN, false);
            setIsAdminRole(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appUser?.roles]);

    useEffect(() => {
        setIsAdmin(isAdminRole);
    }, [isAdminRole]);

    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen);
    };

    const handleClose = (event: MouseEvent | TouchEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleOpenPreferences = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        isOpen: boolean
    ) => {
        setOpenPreferences(isOpen);
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleIconMouseOver = () => {
        setColor(theme.palette.text.primary);
    };

    const handleIconMouseLeave = () => {
        setColor(theme.palette.text.primary);
    };

    const isSettingsVisible = isAdmin && appUser?.scopes.includes(ROLE_PERMISSIONS.WRITE);

    return isSettingsVisible ? (
        <div className={classes.root}>
            <QplusBaseIconTooltip placement="left" title={t("sih-header-control-settings-tooltip")}>
                <IconButton
                    ref={anchorRef}
                    onClick={handleToggle}
                    className={classes.settingsIconButton}
                    onMouseOver={handleIconMouseOver}
                    onMouseLeave={handleIconMouseLeave}
                    disabled={!isSettingsVisible}>
                    <SettingsIcon
                        fill={color}
                        className={
                            pathname?.includes("administration") ? classes.iconActive : classes.icon
                        }
                    />
                </IconButton>
            </QplusBaseIconTooltip>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                style={{ zIndex: 9999 }}>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            zIndex: 9999,
                            transformOrigin: placement === "bottom" ? "center top" : "center bottom"
                        }}>
                        <Paper style={{ zIndex: 1000000000 }}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList style={{ zIndex: 1000000000, fontSize: "12px" }}>
                                    <MenuItem
                                        className={classes.menuItem}
                                        onClick={e => handleOpenPreferences(e, true)}>
                                        <Link
                                            style={{ color: "inherit", textDecoration: "none" }}
                                            to="/apps/dashboards/administration">
                                            <Typography className={classes.text}>
                                                {t("sih-header-control-settings-menu-admin")}
                                            </Typography>
                                        </Link>
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    ) : null;
};

export default React.memo(SettingsPopper);
