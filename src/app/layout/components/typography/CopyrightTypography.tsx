import React from "react";
import Typography from "@mui/material/Typography";
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";

const useStyles = makeStyles()((theme: Theme) => ({
    copyright: {
        color: theme?.palette.common.secondaryText,
        fontSize: "0.7rem",
        maxWidth: "18.5rem",
        lineHeight: "1rem",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    }
}));

function CopyrightTypography() {
    const { classes } = useStyles();

    return (
        <Typography className={classes.copyright}>
            {`@ 2024-${new Date().getFullYear()} Siemens Healthcare GMBH, all rights reserved`}
        </Typography>
    );
}

export default React.memo(CopyrightTypography);
