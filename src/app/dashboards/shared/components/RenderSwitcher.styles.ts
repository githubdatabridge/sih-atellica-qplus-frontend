import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        marginLeft: "8px",
        marginRight: "8px",
        marginTop: "20px",
        marginBottom: "8px"
    },
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`
    },
    toolbarMenu: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "44px",
        minWidth: "175px",
        borderLeft: `1px solid ${theme.palette.divider}`
    },
    settingsIconButton: {
        "&:hover": {
            cursor: "pointer"
        }
    }
}));
