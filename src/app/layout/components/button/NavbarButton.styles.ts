import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme: Theme) => ({
    drawerItem: {
        height: "100px",
        width: "100%",
        justifyContent: "center",
        color: theme.palette.primary.dark,
        alignItems: "center",
        "& > *": {
            strokeColor: theme.palette.primary.contrastText
        },
        "&.nav-active": {
            color: theme.palette.primary.light
        },
        paddingLeft: "48px",
        paddingRight: "24px"
    }
}));
