import React, { ReactNode } from "react";
import { NavLinkProps } from "react-router-dom";
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material/styles";
import ButtonBase, { ButtonBaseProps } from "@mui/material/ButtonBase";

type NavbarButtonProps = {
  children?: ReactNode;
};

type Props = NavbarButtonProps & ButtonBaseProps & NavLinkProps;

const NavbarButton = ({ children, ...navbarProps }: Props) => {
  const { classes } = useStyles();

  return (
    <ButtonBase
      focusRipple
      className={classes.drawerItem}
      // component={NavLink}
      // activeClassName={'nav-active'}
      {...navbarProps}
    >
      {children}
    </ButtonBase>
  );
};

const useStyles = makeStyles()((theme: Theme) => ({
  drawerItem: {
    height: "100px",
    width: "100%",
    justifyContent: "center",
    color: theme.palette.primary.dark,
    alignItems: "center",
    "& > *": {
      strokeColor: theme.palette.primary.contrastText,
    },
    "&.nav-active": {
      color: theme.palette.primary.light,
    },
    paddingLeft: "48px",
    paddingRight: "24px",
  },
}));

export default NavbarButton;
