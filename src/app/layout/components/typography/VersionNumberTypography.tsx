import React from "react";
import Typography from "@mui/material/Typography";
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";

const useStyles = makeStyles()((theme: Theme) => ({
    version: {
        color: theme?.palette.common.primaryText,
        fontSize: "1rem",
        maxWidth: "18.5rem",
        lineHeight: "1rem",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    }
}));

const APP_VERSION = import.meta.env.VITE_APP_VERSION || "N/A";

function VersionNumberTypography() {
    const { classes } = useStyles();

    return <Typography className={classes.version}>{`${APP_VERSION}`}</Typography>;
}

export default React.memo(VersionNumberTypography);
