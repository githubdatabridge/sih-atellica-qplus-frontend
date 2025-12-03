import React from "react";
import { Link, useLocation } from "react-router-dom";
import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material";

import NavbarButtonBase from "./NavbarButtonBase";

type Props = {
  path?: string;
  title: string;
};

const NavbarButtonLink = ({ path, title }: Props) => {
  const theme = useTheme<Theme>();
  const location = useLocation();
  const name = /[^/]*$/.exec(location.pathname)[0];
  const [navColor, setNavColor] = React.useState<string>(
    theme.palette.common.secondaryText
  );
  const [isNavMenuHover, setIsNavMenuHover] = React.useState<boolean>(false);

  const useStyles = makeStyles()((theme: Theme) => ({
    link: {
      minHeight: "72px",
      minWidth: "120px",
      "@media (max-width: 1149px)": {
        minWidth: "80px",
      },
      "@media (max-width: 951px)": {
        justifyContent: "center",
        width: "100%",
      },
    },
    title: {
      marginTop: theme.spacing(1),
      fontWeight: 600,
      fontSize: "0.875rem",
      color: theme.palette.common.secondaryText,
      "@media (max-width: 951px)": {
        fontSize: 16,
      },
    },
  }));

  const { classes } = useStyles();

  const navMenuEnter = () => {
    setIsNavMenuHover(true);
  };

  const navMenuLeave = () => {
    setIsNavMenuHover(false);
    setNavColor(null);
  };

  const fillColor = (color: string) => {
    return isNavMenuHover ||
      `${location.pathname}`.startsWith(path) ||
      isNavMenuHover ||
      name.toLowerCase() === title.toLowerCase()
      ? theme.palette.common.primaryText
      : color;
  };

  const setBorder = (border: string) => {
    return isNavMenuHover ||
      `${location.pathname}`.startsWith(path) ||
      isNavMenuHover ||
      name.toLowerCase() === title.toLowerCase()
      ? "2px solid #ec6602"
      : border;
  };

  return (
    <Link
      to={path}
      style={{
        textDecoration: "none",
      }}
    >
      <NavbarButtonBase
        to={path}
        onClick={navMenuEnter}
        onMouseLeave={navMenuLeave}
        className={classes.link}
        style={{
          borderBottom: setBorder("none"),
        }}
      >
        <Typography
          className={classes.title}
          style={{
            color: fillColor(navColor),
          }}
        >
          {title}
        </Typography>
      </NavbarButtonBase>
    </Link>
  );
};

export default NavbarButtonLink;
