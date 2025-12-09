import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme: Theme) => ({
    link: {
        minHeight: "72px",
        minWidth: "120px",
        "@media (max-width: 1149px)": {
            minWidth: "80px"
        },
        "@media (max-width: 951px)": {
            justifyContent: "center",
            width: "100%"
        }
    },
    title: {
        marginTop: theme.spacing(1),
        fontWeight: 600,
        fontSize: "0.875rem",
        color: theme.palette.common.secondaryText,
        "@media (max-width: 951px)": {
            fontSize: 16
        }
    }
}));
