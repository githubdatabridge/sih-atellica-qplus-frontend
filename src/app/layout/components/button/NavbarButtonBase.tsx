import React, { ReactNode } from "react";
import { NavLinkProps } from "react-router-dom";
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material/styles";
import ButtonBase, { ButtonBaseProps } from "@mui/material/ButtonBase";

type NavbarButtonBaseProps = {
    children?: ReactNode;
};

type Props = NavbarButtonBaseProps & ButtonBaseProps & NavLinkProps;

function NavbarButtonBase({ children, ...navbarProps }: Props) {
    const useStyles = makeStyles()((theme: Theme) => ({
        drawerItem: {
            height: "50px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            color: theme.palette.text.primary,
            textAlign: "center",
            alignItems: "center",
            "& > *": {
                strokeColor: theme.palette.text.primary
            },
            "&.nav-active": {
                color: theme.palette.text.primary
            },
            paddingLeft: "20px",
            paddingRight: "20px"
        }
    }));
    const { classes } = useStyles();

    return (
        <ButtonBase focusRipple className={classes.drawerItem} {...navbarProps}>
            {children}
        </ButtonBase>
    );
}

export default NavbarButtonBase;
