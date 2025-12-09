import React from "react";
import { useMediaQuery } from "react-responsive";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import { Box } from "@mui/material";

import SvgLogo from "assets/icons/logo.svg";

import Navbar from "./Navbar";
import { useStyles } from "./SideDrawer.styles";

interface Props {
    isOpen: boolean;
    closeDrawer: () => void;
}

function SideDrawer({ isOpen, closeDrawer }: Props) {
    const { classes } = useStyles();
    const isMobile = useMediaQuery({ query: "(max-width: 570px)" });

    const toggleDrawer = () => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event &&
            event.type === "keydown" &&
            ((event as React.KeyboardEvent).key === "Tab" ||
                (event as React.KeyboardEvent).key === "Shift")
        ) {
            return;
        }

        closeDrawer();
    };

    const list = () => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer()}
            onKeyDown={toggleDrawer()}>
            <List>
                {isMobile && (
                    <Box textAlign="center" mt={2}>
                        <img
                            src={SvgLogo}
                            alt="Logo"
                            style={{ height: "2.5rem", width: "8.125rem" }}
                        />
                    </Box>
                )}
                <Navbar />
            </List>
        </div>
    );

    return (
        <div>
            <SwipeableDrawer
                className={classes.backdrop}
                open={isOpen}
                onClose={toggleDrawer()}
                onOpen={toggleDrawer()}
                classes={{ paper: classes.paper }}>
                {list()}
            </SwipeableDrawer>
        </div>
    );
}

export default SideDrawer;
