import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme: Theme) => ({
    selectionBar: {
        boxShadow: "none",
        backgroundColor: "transparent",
        zIndex: 99999,
        width: "100%",
        marginTop: "-55px"
    },
    container: {
        width: 250
    },
    list: {
        backgroundColor: theme.palette.primary.main
    },
    listItem: {
        paddingLeft: "30px",
        backgroundColor: theme.palette.primary.main,
        cursor: "default",
        "&:hover": {
            backgroundColor: theme.palette.primary.main
        },
        zIndex: 999
    },
    listItemText: {
        width: "100%",
        textAlign: "start",
        "& span": {
            fontSize: "0.925rem",
            fontWeight: 600,
            color: theme.palette.primary.contrastText
        }
    },
    iconButton: {
        color: theme.palette.primary.contrastText
    },
    emptyText: {
        color: theme.palette.primary.contrastText,
        fontSize: "0.825rem",
        fontStyle: "italic"
    }
}));
