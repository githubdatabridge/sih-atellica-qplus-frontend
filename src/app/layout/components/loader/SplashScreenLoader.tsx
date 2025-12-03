import React from "react";
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";

const SplashScreenLoader = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.progressSuccess}>
      <svg role="alert" aria-live="assertive">
        <rect x="1" y="1" rx="5" ry="5" className={classes.empty} />
        <rect x="1" y="1" className={classes.filling} rx="5" ry="5" />
      </svg>
    </div>
  );
};

export default React.memo(SplashScreenLoader);

const useStyles = makeStyles()((theme: Theme) => ({
  progressSuccess: {
    color: theme.palette.secondary.main,
    fontSize: "1rem",
    width: "100%",
    lineHeight: "1rem",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    textAlign: "center",
  },
  empty: {
    width: "300px",
    height: "5px",
    fill: theme?.palette.common.highlight20,
  },
  filling: {
    width: "300px",
    height: "5px",
    fill: theme.palette.secondary.main,
    animation: "fillBar 1.5s ease-in-out 0s normal infinite",
  },
}));
