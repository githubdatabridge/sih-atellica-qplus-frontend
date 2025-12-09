import React from "react";
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material";

const useStyles = makeStyles()((theme: Theme) => ({
    product: {
        color: theme?.palette.common.primaryText,
        fontSize: "1.25rem",
        maxWidth: "18.5rem",
        lineHeight: "2rem",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontFamily: "bree-headline"
    }
}));

function ProductInfoTypography() {
    const { classes } = useStyles();

    return <Typography className={classes.product}>Atellica® Connect POC Self Service</Typography>;
}

export default React.memo(ProductInfoTypography);
