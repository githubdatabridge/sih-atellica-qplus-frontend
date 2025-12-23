import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((_theme: Theme) => ({
    selectionBar: {
        boxShadow: "none",
        backgroundColor: "transparent",
        zIndex: 99999,
        width: "100%",
        marginTop: "-55px"
    }
}));
