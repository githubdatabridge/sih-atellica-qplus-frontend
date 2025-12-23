import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((_theme: Theme) => ({
    list: {
        overflow: "auto",
        display: "flex",
        flexDirection: "row",
        justifyContent: "left",
        marginLeft: "50px",
        marginTop: "-10px",
        "@media (max-width: 1029px)": {
            marginLeft: "20px"
        },
        "@media (max-width: 951px)": {
            flexDirection: "column",
            marginLeft: "0px",
            textAlign: "center"
        }
    },
    listItem: {
        paddingRight: "10px",
        paddingLeft: "10px",
        "@media (max-width: 951px)": {
            alignSelf: "center",
            width: "100%",
            paddingRight: "0px",
            paddingLeft: "0px"
        }
    }
}));
