import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme: Theme) => ({
    customBadge: {
        backgroundColor: theme?.palette.common.ui0,
        color: theme?.palette.common.whiteText
    },
    button: {
        height: 60,
        width: 60,
        display: "flex",
        alignItems: "center",
        color: theme.palette.text.primary,
        padding: theme.spacing(1),
        textAlign: theme.direction === "ltr" ? "left" : "right",
        marginRight: "10px",
        "@media (max-width: 500px)": {
            width: 32,
            marginRight: 0,
            "& > span": {
                width: "24px"
            }
        }
    }
}));
