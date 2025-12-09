import { Theme, lighten } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        display: "flex",
        marginRight: 1,
        "& > *": {
            margin: theme.spacing(1)
        }
    },
    avatar: {
        color: theme.palette.common.secondaryText,
        backgroundColor: theme.palette.common.highlight10,
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: 0,
        lineHeight: "20px",
        textAlign: "center",
        height: "40px",
        width: "40px",
        "&:hover": {
            color: theme.palette.common.secondaryText,
            backgroundColor: theme.palette.common.highlight10,
            boxShadow: "none !important"
        }
    },
    button: {
        height: "40px",
        borderRadius: "32px",
        backgroundColor: `${theme.palette.primary.contrastText} !important`,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        flexDirection: "row",
        boxShadow: "none",
        "&:hover": {
            // you want this to be the same as the backgroundColor above
            backgroundColor: `${theme.palette.primary.contrastText} !important`,
            boxShadow: "none !important"
        }
    },
    paper: {
        marginRight: theme.spacing(2)
    },
    icon: {
        color: "#273540",
        width: "24px",
        height: "24px"
    },
    menuItem: {
        fontWeight: 500,
        color: "#000"
    },
    username: {
        textAlign: "left",
        paddingLeft: "10px",
        color: theme.palette.text.primary,
        opacity: 0.7,
        fontWeight: 600,
        fontSize: "0.875rem !important",
        "@media (max-width: 1238px)": {
            display: "none"
        }
    },
    role: {
        textAlign: "left",
        paddingLeft: "10px",
        color: lighten(theme.palette.text.primary, 0.5),
        fontWeight: 500,
        fontSize: "0.725rem !important",
        "@media (max-width: 1238px)": {
            display: "none"
        }
    },
    listItemCheckbox: {
        marginLeft: "5px",
        width: "20px",
        height: "20px",
        "&:hover": {
            backgroundColor: "transparent"
        }
    },
    dropdown: {
        "@media (max-width: 1238px)": {
            left: "0px !important"
        },
        "@media (max-width: 675px)": {
            left: "-15px !important"
        },
        "@media (max-width: 655px)": {
            left: "-25px !important"
        },
        "@media (max-width: 630px)": {
            left: "-30px !important"
        },
        "@media (max-width: 590px)": {
            left: "-35px !important"
        }
    }
}));
