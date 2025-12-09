import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme: Theme) => ({
    progressSuccess: {
        color: theme.palette.secondary.main,
        fontSize: "1rem",
        width: "100%",
        lineHeight: "1rem",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        textAlign: "center"
    },
    empty: {
        width: "300px",
        height: "5px",
        fill: theme?.palette.common.highlight20
    },
    filling: {
        width: "300px",
        height: "5px",
        fill: theme.palette.secondary.main,
        animation: "fillBar 1.5s ease-in-out 0s normal infinite"
    }
}));
