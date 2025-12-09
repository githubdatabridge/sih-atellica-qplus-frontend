import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme: Theme) => ({
    grid: {
        paddingLeft: "4px",
        paddingRight: "4px",
        paddingBottom: "4px",
        paddingTop: "4px"
    },
    gridFilter: {
        paddingLeft: "4px",
        paddingRight: "4px",
        paddingBottom: "4px",
        paddingTop: "4px",
        backgroundColor: "transparent"
    },
    gridNestedDetail: {
        paddingLeft: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingTop: "0px"
    },
    gridHeader: {
        backgroundColor: theme.palette.common.base2,
        padding: "0 12px",
        borderRadius: "4px 4px 0 0",
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%"
    },
    gridHeaderTypography: {
        fontSize: "0.925rem",
        fontWeight: 600,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    },
    vizHeaderActions: {
        marginBottom: "-20px !important"
    },
    toolbarIcon: {
        height: "0.925rem",
        width: "0.925rem"
    }
}));
