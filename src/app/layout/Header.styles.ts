import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme: Theme) => ({
    appBar: {
        zIndex: 2,
        height: 72,
        backgroundColor: theme.palette.background.paper,
        boxShadow: "inset 0 -1px 0 0 #EBEBEB"
    },
    toolbar: {
        paddingLeft: theme.spacing(3),
        minHeight: 72
    },
    logo: {
        "@media (max-width: 1029px)": {
            marginRight: 20
        },
        "@media (max-width: 570px)": {
            display: "none"
        }
    },
    version: {
        fontSize: "0.675rem",
        color: theme.palette.text.primary,
        marginTop: "-10px"
    },
    brand: {
        flexGrow: 1
    },
    divider: {
        height: 72
    },
    title: {
        color: theme?.palette.common.primaryText,
        fontSize: "1rem",
        maxWidth: "18.5rem",
        lineHeight: "2rem",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontFamily: "bree-headline"
    },
    empty: {
        marginRight: "20px",
        "@media (max-width: 971px)": {
            marginRight: "0px"
        }
    },
    burgerMenu: {
        color: theme?.palette.common.secondaryText,
        cursor: "pointer",
        "&:hover": {
            color: theme?.palette.common.primaryText
        }
    },
    notificationButton: {
        fontSize: "12px",
        fontWeight: 500,
        height: "30px",
        borderRadius: "25px",
        minWidth: "150px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.info.main,
        color: theme.palette.info.contrastText,
        "&:hover": {
            backgroundColor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
            boxShadow: "none"
        },
        "&:focus": {
            backgroundColor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
            boxShadow: "none"
        },
        cursor: "pointer",
        "@media (max-width: 350px)": {
            minWidth: "120px"
        }
    }
}));
