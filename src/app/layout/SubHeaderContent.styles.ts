import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme: Theme) => ({
    container: {
        width: "100%",
        minHeight: "150px",
        backgroundColor: theme.palette.background.default
    },
    controlButton: {
        borderRadius: "50px",
        backgroundColor: theme.palette.common.base1,
        color: theme.palette.primary.main
    },
    controlButtonDisabled: {
        borderRadius: "50px",
        backgroundColor: `${theme.palette.common.base1} !important`,
        color: theme.palette.text.disabled
    },
    view: {
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingTop: "16px",
        paddingBottom: "0px"
    },
    subView: {
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingTop: "8px"
    },
    clearContainer: {
        paddingTop: "12px"
    },
    iconButton: {
        backgroundColor: theme.palette.common.highlight10,
        width: "40px",
        height: "40px",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: theme.palette.common.highlight20
        }
    },
    iconText: {
        fontSize: "0.9rem"
    },
    actionButton: {
        height: "35px",
        width: "120px",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: "25px",
        backgroundColor: "transparent",
        color: theme.palette.common.primaryText,
        marginTop: "2px",
        fontSize: "14px",
        fontWeight: 600,
        letterSpacing: 0,
        lineHeight: "20px",
        textAlign: "center",
        boxShadow: "none",
        textTransform: "none",
        "&:hover": {
            backgroundColor: theme.palette.common.highlight10,
            boxShadow: "none"
        },
        "&:focus": {
            backgroundColor: "#EBEBEB",
            color: theme.palette.secondary.dark,
            boxShadow: "none"
        }
    },
    actionButtonText: {
        fontSize: "14px",
        fontWeight: 600,
        color: theme.palette.common.primaryText
    }
}));
