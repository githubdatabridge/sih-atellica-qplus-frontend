import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        flexGrow: 1
    },
    header: {
        boxShadow: "0 0 0rem rgba(0,0,0,0.20);"
    },
    paper: {
        textAlign: "center",
        border: "none",
        boxShadow: "none",
        color: theme.palette.text.secondary,
        borderRadius: "8px"
    },
    list: {
        overflow: "auto",
        display: "flex",
        width: "100%",
        padding: "0px",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "left",
        backgroundColor: theme.palette.background.default,
        boxShadow: "0 0 0rem rgba(0,0,0,0.20);"
    },
    listItem: {
        fontWeight: 600,
        padding: "15px 20px",
        fontSize: "14px",
        "&:hover": {
            cursor: "pointer"
        }
    }
}));
