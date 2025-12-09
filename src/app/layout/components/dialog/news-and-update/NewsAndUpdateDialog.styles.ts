import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme: Theme) => ({
    content: {
        padding: "30px 30px 20px 307px",
        borderRadius: "8px",
        minHeight: "488px",
        position: "relative",
        overflow: "hidden",
        flex: "1 1 auto",
        display: "flex",
        wordWrap: "break-word"
    },
    main: {
        right: "-104px",
        left: "208px",
        background: theme.palette.common.white,
        borderRadius: "50%",
        position: "absolute",
        top: "-104px",
        bottom: "-104px",
        pointerEvents: "none"
    },
    helper: {
        right: 0,
        left: "50%",
        background: theme.palette.common.white,
        position: "absolute",
        top: 0,
        bottom: 0,
        pointerEvents: "none"
    },
    arrow: {
        left: "239px",
        transform: "rotate(32.77deg)",
        transformOrigin: "0 0",
        background: theme.palette.common.white,
        position: "absolute",
        width: "100px",
        height: "100px",
        bottom: "151px",
        pointerEvents: "none"
    }
}));
