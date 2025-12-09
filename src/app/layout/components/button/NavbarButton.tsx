import React, { ReactNode } from "react";
import { NavLinkProps } from "react-router-dom";
import ButtonBase, { ButtonBaseProps } from "@mui/material/ButtonBase";

import { useStyles } from "./NavbarButton.styles";

type NavbarButtonProps = {
    children?: ReactNode;
};

type Props = NavbarButtonProps & ButtonBaseProps & NavLinkProps;

function NavbarButton({ children, ...navbarProps }: Props) {
    const { classes } = useStyles();

    return (
        <ButtonBase
            focusRipple
            className={classes.drawerItem}
            // component={NavLink}
            // activeClassName={'nav-active'}
            {...navbarProps}>
            {children}
        </ButtonBase>
    );
}

export default NavbarButton;
