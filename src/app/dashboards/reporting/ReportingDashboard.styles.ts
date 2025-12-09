import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        flexGrow: 1
    },
    reportingRoot: {
        border: "1px solid red"
    },
    header: {
        boxShadow: "0 0 0rem rgba(0,0,0,0.20);"
    },
    paper: {
        textAlign: "center",
        border: "none",
        boxShadow: "none",
        color: theme.palette.text.secondary,
        margin: "8px",
        borderRadius: "8px"
    },
    vizToolbarIcon: {
        height: "0.925rem",
        width: "0.925rem"
    }
}));
