import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        display: "flex"
    },
    menuItem: {
        fontWeight: 500
    },
    text: {
        color: theme.palette.text.primary,
    },
    icon: {
        width: 32,
        height: 32,
        backgroundColor: "transparent",
        color: theme!.palette.common.secondaryText,
        "&:hover": {
            backgroundColor: "transparent",
            color: theme!.palette.common.secondaryText
        },
        "@media (max-width: 500px)": {
            width: "24px"
        }
    },
    iconActive: {
        width: 32,
        height: 32,
        backgroundColor: "transparent",
        color: theme!.palette.secondary.main,
        "&:hover": {
            backgroundColor: "transparent",
            color: theme!.palette.secondary.main
        },
        "@media (max-width: 500px)": {
            width: "24px"
        }
    },
    settingsIconButton: {
        backgroundColor: "transparent",
        "&:hover": {
            cursor: "pointer",
            backgroundColor: "transparent"
        },
        "@media (max-width: 500px)": {
            padding: "6px",
            "& > span": {
                width: "24px"
            }
        }
    }
}));
