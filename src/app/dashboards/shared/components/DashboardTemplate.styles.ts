import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme: Theme) => ({
    header: {
        boxShadow: "0 0 0rem rgba(0,0,0,0.20);"
    },
    content: {
        padding: "16px",
        backgroundColor: theme.palette.common.base1,
        overflowY: "scroll"
    }
}));
