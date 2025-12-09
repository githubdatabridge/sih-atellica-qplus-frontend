import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()({
    list: {
        width: 250
    },

    paper: {
        top: "70px",
        boxShadow: "none"
    },
    navBarLink: {
        borderBottom: "2px solid #E5E5E5",
        padding: "15px 30px 15px 30px ",
        width: "100%"
    },
    backdrop: {
        "& div": {
            top: "70px",
            "@media (max-width: 475px)": {
                width: "100%"
            }
        }
    }
});
