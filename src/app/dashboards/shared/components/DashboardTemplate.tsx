import React, { FC, ReactNode, useEffect, useState } from "react";
import { Box } from "@mui/material";

import { useWindowDimensions } from "@databridge/qplus";
import { OFFSET_COLLAPSED, OFFSET_EXPANDED } from "app/common/config";
import { useAppContext } from "app/context/AppContext";
import { useStyles } from "./DashboardTemplate.styles";

interface IDashboardTemplateProps {
    children: ReactNode;
}

const DashboardTemplate: FC<IDashboardTemplateProps> = ({ children }) => {
    const { classes } = useStyles();

    const { height } = useWindowDimensions();
    const { isHeaderVisible } = useAppContext();

    const [windowHeight, setWindowHeight] = useState<number>(0);

    useEffect(() => {
        setWindowHeight(height);
    }, [height]);

    if (windowHeight === 0) return null;

    return (
        <Box
            className={classes.content}
            sx={{
                marginTop: isHeaderVisible ? `${OFFSET_EXPANDED}px` : `${OFFSET_COLLAPSED}px`,
                height: `${windowHeight - (isHeaderVisible ? OFFSET_EXPANDED : OFFSET_COLLAPSED)}px`
            }}>
            {children}
        </Box>
    );
};

export default DashboardTemplate;
