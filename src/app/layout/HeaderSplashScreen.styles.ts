import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme: Theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        height: 72,
        backgroundColor: theme.palette.background.paper,
        boxShadow: "inset 0 -1px 0 0 #EBEBEB"
    },
    toolbar: {
        paddingLeft: theme.spacing(3),
        minHeight: 72
    },
    logo: {
        width: 140,
        height: 55
    }
}));
