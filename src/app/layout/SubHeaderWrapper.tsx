import React, { useEffect, useState } from "react";
import { AppBar, Box, Toolbar } from "@mui/material";

import { OFFSET_COLLAPSED, OFFSET_EXPANDED } from "app/common/config";
import SubHeaderContent from "./SubHeaderContent";
import { Page } from "./components/select/SelectView";
import ToggleButton from "./components/button/ToggleButton";
import { useStyles } from "./SubHeaderWrapper.styles";

interface ISubHeaderWrapperProps {
    parentPages: Page[];
    subPages?: string[];
    currentSubPage?: string;
    shouldHideSubSettings?: boolean;
    isHeaderVisible?: boolean;
    handlePageChangeCallback?: (page: string) => void;
    handleSubPageChangeCallback?: (subPage: string) => void;
    handleHeaderToggleCallback?: (toggle: boolean) => void;
}

const SubHeaderWrapper: React.FC<ISubHeaderWrapperProps> = ({
    parentPages,
    subPages: _subPages = [],
    currentSubPage: _currentSubPage = "",
    shouldHideSubSettings = true,
    isHeaderVisible = true,
    handlePageChangeCallback,
    handleSubPageChangeCallback: _handleSubPageChangeCallback,
    handleHeaderToggleCallback
}) => {
    const [isHeader, setIsHeader] = useState<boolean>(isHeaderVisible);
    const { classes } = useStyles();

    useEffect(() => {
        setIsHeader(isHeaderVisible);
    }, [isHeaderVisible]);

    return (
        <>
            <div style={{ display: !isHeader ? "none" : "block" }}>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar disableGutters>
                        <Box className={classes.header}>
                            <SubHeaderContent
                                parentPages={parentPages}
                                shouldHideSubSettings={shouldHideSubSettings}
                                handleOnPageChangeCallback={handlePageChangeCallback}
                            />
                        </Box>
                    </Toolbar>
                </AppBar>
            </div>

            <Box
                position="absolute"
                sx={{
                    marginTop: isHeaderVisible
                        ? `${OFFSET_EXPANDED - 15}px`
                        : `${OFFSET_COLLAPSED - 15}px`,
                    marginLeft: "50%"
                }}>
                <Box width="100%" className={classes?.toggle} textAlign="center">
                    <ToggleButton handleToggleHeaderCallback={handleHeaderToggleCallback} />
                </Box>
            </Box>
        </>
    );
};

export default SubHeaderWrapper;
