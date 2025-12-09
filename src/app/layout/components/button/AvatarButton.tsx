import { FC, memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Typography from "@mui/material/Typography";
import {
    QPLUS_KEYS,
    QplusLocalStorage,
    useQplusAuthContext,
    useQplusCoreAuthContext,
    useQplusReportingContext
} from "@databridge/qplus";

import { useAppContext } from "app/context/AppContext";
import { DASHBOARD_URL_PATH } from "app/layout/constants/constants";
import { QPLUS_USER_ROLES } from "app/shared/constants/constants";
import { useUserRole } from "app/shared/hooks";
import { useStyles } from "./AvatarButton.styles";

interface IUserAvatar {
    mode?: string;
}

const UserAvatar: FC<IUserAvatar> = () => {
    const { classes } = useStyles();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const isTablet = useMediaQuery({ query: "(max-width: 1001px)" });

    const { appUser } = useQplusAuthContext();
    const { logout } = useQplusCoreAuthContext();
    const { setIsAdminRole, isAdminRole, logoutUser } = useAppContext();
    const { clearReport } = useQplusReportingContext();

    const [open, setOpen] = useState<boolean>(false);
    const [isGodModeVisible, setIsGodModeVisible] = useState<boolean>(false);
    const [avatar, setAvatar] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const anchorRef = useRef(null);

    const handleClose = (event: MouseEvent | TouchEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen: boolean) => !prevOpen);
    };

    const handleLogout = async () => {
        try {
            await logout();
            logoutUser();
        } catch (error) {
            console.log("DEV Logout", error);
        }
    };

    const handleIsAdminSwitch = () => {
        QplusLocalStorage.save(QPLUS_KEYS.QPLUS_ROLE_IS_ADMIN, !isAdminRole);
        clearReport();
        setIsAdminRole(!isAdminRole);
        // To refresh all the necessary settings in the reporting component we temporary navigate to a loader page and back
        navigate(`${DASHBOARD_URL_PATH}/loader`);
    };

    useEffect(() => {
        if (appUser) {
            setUsername(appUser.name);
            setAvatar(appUser.avatar);
            setIsGodModeVisible(appUser?.roles?.includes(QPLUS_USER_ROLES.ADMIN));
        }
    }, [appUser]);

    const currentRole = useUserRole(appUser, isAdminRole);

    return (
        <div className={classes.root}>
            <Button
                ref={anchorRef}
                aria-controls={open ? "menu-avatar-grow" : undefined}
                aria-haspopup="true"
                variant="contained"
                classes={{ root: classes.button }}
                onClick={handleToggle}>
                <Avatar src="" className={classes.avatar}>
                    {avatar}
                </Avatar>
                {!isTablet && (
                    <Box display="flex" flexDirection="column">
                        <Typography className={classes.username}>{username}</Typography>
                        <Typography className={classes.role}>{currentRole}</Typography>
                    </Box>
                )}
            </Button>
            <Popper
                className={classes.dropdown}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                style={{ zIndex: 1000000000 }}>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            zIndex: 1000000000,
                            transformOrigin: placement === "bottom" ? "center top" : "center bottom"
                        }}>
                        <Paper style={{ zIndex: 1000000000, minWidth: "150px" }}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={open}
                                    id="menu-avatar-grow"
                                    style={{ zIndex: 1000000000, fontSize: "12px" }}>
                                    <MenuItem className={classes.menuItem} onClick={handleLogout}>
                                        {t("sih-header-control-avatar-menu-logout")}
                                    </MenuItem>
                                    {isGodModeVisible && (
                                        <MenuItem className={classes.menuItem}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={isAdminRole}
                                                            color="secondary"
                                                            onClick={handleIsAdminSwitch}
                                                        />
                                                    }
                                                    label={t(
                                                        "sih-header-control-avatar-menu-admin"
                                                    )}
                                                />
                                            </FormGroup>
                                        </MenuItem>
                                    )}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    );
};

export default memo(UserAvatar);
