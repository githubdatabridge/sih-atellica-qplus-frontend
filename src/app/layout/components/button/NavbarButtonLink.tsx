import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material";

import NavbarButtonBase from "./NavbarButtonBase";
import { useStyles } from "./NavbarButtonLink.styles";

type Props = {
    path?: string;
    title: string;
};

function NavbarButtonLink({ path, title }: Props) {
    const theme = useTheme<Theme>();
    const { classes } = useStyles();
    const location = useLocation();

    const name = /[^/]*$/.exec(location.pathname)[0];
    const [navColor, setNavColor] = React.useState<string>(theme.palette.common.secondaryText);
    const [isNavMenuHover, setIsNavMenuHover] = React.useState<boolean>(false);

    const navMenuEnter = () => {
        setIsNavMenuHover(true);
    };

    const navMenuLeave = () => {
        setIsNavMenuHover(false);
        setNavColor(null);
    };

    const fillColor = (color: string) =>
        isNavMenuHover ||
        `${location.pathname}`.startsWith(path) ||
        isNavMenuHover ||
        name.toLowerCase() === title.toLowerCase()
            ? theme.palette.common.primaryText
            : color;

    const setBorder = (border: string) =>
        isNavMenuHover ||
        `${location.pathname}`.startsWith(path) ||
        isNavMenuHover ||
        name.toLowerCase() === title.toLowerCase()
            ? "2px solid #ec6602"
            : border;

    return (
        <Link
            to={path}
            style={{
                textDecoration: "none"
            }}>
            <NavbarButtonBase
                to={path}
                onClick={navMenuEnter}
                onMouseLeave={navMenuLeave}
                className={classes.link}
                style={{
                    borderBottom: setBorder("none")
                }}>
                <Typography
                    className={classes.title}
                    style={{
                        color: fillColor(navColor)
                    }}>
                    {title}
                </Typography>
            </NavbarButtonBase>
        </Link>
    );
}

export default NavbarButtonLink;
