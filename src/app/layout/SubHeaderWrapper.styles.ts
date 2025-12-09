import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme: Theme) => ({
    appBar: {
        zIndex: 1,
        backgroundColor: theme.palette.background.paper,
        boxShadow: "inset 0 -1px 0 0 #EBEBEB",
        marginTop: 72
    },
    header: {
        boxShadow: "0 0 0rem rgba(0,0,0,0.20);",
        width: "100%"
    },
    toggle: {
        height: "20px"
    }
}));
