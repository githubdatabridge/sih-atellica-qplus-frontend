import React from "react";

import { useStyles } from "./SplashScreenLoader.styles";

function SplashScreenLoader() {
    const { classes } = useStyles();

    return (
        <div className={classes.progressSuccess}>
            <svg role="alert" aria-live="assertive">
                <rect x="1" y="1" rx="5" ry="5" className={classes.empty} />
                <rect x="1" y="1" className={classes.filling} rx="5" ry="5" />
            </svg>
        </div>
    );
}

export default React.memo(SplashScreenLoader);
