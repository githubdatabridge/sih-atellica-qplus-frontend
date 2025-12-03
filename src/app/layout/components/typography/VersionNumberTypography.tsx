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
    whiteSpace: "nowrap",
  },
}));

const VersionNumberTypography = () => {
  const { classes } = useStyles();

  return <Typography className={classes.version}>Version 0.9</Typography>;
};

export default React.memo(VersionNumberTypography);
