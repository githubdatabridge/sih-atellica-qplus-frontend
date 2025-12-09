import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import querystring from "query-string";
import { Box, CircularProgress, IconButton, Theme, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarksOutlinedIcon from "@mui/icons-material/BookmarksOutlined";
import {
    QplusBaseIconTooltip,
    QplusApiBookmarkCreateDialog,
    QplusApiBookmarkListDialog,
    QplusFilterDialog,
    QplusSelectionBarDocked,
    useQplusReportingContext,
    useQplusSelectionContext,
    useWindowDimensions,
    useQplusLoaderContext,
    QplusUndoButton,
    QplusRedoButton
} from "@databridge/qplus";

import { useAppContext } from "app/context/AppContext";
import ClearButton from "app/layout/components/button/ClearButton";
import SelectionBar from "app/layout/components/chip/SelectionBar";

import SvgFilterUserIcon from "assets/icons/SvgFilterUserIcon";
import SelectView, { Page } from "./components/select/SelectView";
import { useStyles } from "./SubHeaderContent.styles";

interface SubHeaderContentProps {
    parentPages: Page[];
    additionalContent?: React.ReactNode;
    shouldHideSubSettings?: boolean;
    enableFilters?: boolean;
    handleOnPageChangeCallback: (page: string) => void;
}

const SubHeaderContent: FC<SubHeaderContentProps> = ({
    parentPages,
    additionalContent,
    shouldHideSubSettings = false,
    enableFilters = true,
    handleOnPageChangeCallback
}) => {
    const { t } = useTranslation();
    const location = useLocation();
    const { pathname: pageId } = useLocation();
    const name = /[^/]*$/.exec(location.pathname)[0];
    const theme = useTheme<Theme>();
    const { classes } = useStyles();

    const { isQlikMasterItemLoading } = useQplusLoaderContext();
    const { qGlobalSelectionCount } = useQplusSelectionContext();
    const { clearReport } = useQplusReportingContext();
    const { width } = useWindowDimensions();
    const { pages } = useAppContext();

    const [selectionCounter, setSelectionCounter] = useState<number>(0);
    const [selectionBarWidth, setSelectionBarWidth] = useState<number>();
    const [dockedSelectionBarWidth, setDockedSelectionBarWidth] = useState<number>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const appContext = useAppContext();

    const queryString = querystring.stringify({
        op: "create"
    });

    useEffect(() => {
        setIsLoading(isQlikMasterItemLoading);
    }, [isQlikMasterItemLoading]);

    useEffect(() => {
        const x = width - 525;
        setSelectionBarWidth(width - 275);
        setDockedSelectionBarWidth(x);
    }, [qGlobalSelectionCount, width]);

    useEffect(() => {
        setSelectionCounter(qGlobalSelectionCount);
    }, [qGlobalSelectionCount]);

    const handleOnReportClearClick = () => {
        clearReport();
    };

    const PAGE_NAME = pageId.includes("compliance")
        ? "compliance"
        : pageId.includes("audit")
          ? "audit"
          : "";

    const isMultiAppContext = PAGE_NAME === "";

    return (
        <div className={classes.container}>
            <Box display="flex" className={classes.view}>
                <Box p={1} flexGrow={0} width="25%" maxWidth="300px" minWidth="300px">
                    <SelectView
                        pages={parentPages}
                        handleOnPageChangeCallback={handleOnPageChangeCallback}
                    />
                </Box>

                <Box flexGrow={1} width="60%" pl="40px">
                    <SelectionBar width={selectionBarWidth} />
                </Box>

                <Box
                    width="15%"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                    flexDirection="row">
                    {name === "reporting" ? (
                        <Box mr={1}>
                            <QplusBaseIconTooltip title={t("sih-subheader-button-add-report")}>
                                <IconButton
                                    className={classes.actionButton}
                                    onClick={handleOnReportClearClick}>
                                    <Typography className={classes.actionButtonText}>
                                        {t("sih-subheader-button-add-report")}
                                    </Typography>
                                </IconButton>
                            </QplusBaseIconTooltip>
                        </Box>
                    ) : null}
                    {name === "pinwall" ? (
                        <Box mr={1}>
                            <QplusBaseIconTooltip title="Add PinWall">
                                <IconButton
                                    className={classes.actionButton}
                                    component={Link}
                                    to={`${pageId}?${queryString}`}
                                    key="header-create">
                                    <Typography className={classes.actionButtonText}>
                                        {t("sih-subheader-button-add-pinwall")}
                                    </Typography>
                                </IconButton>
                            </QplusBaseIconTooltip>
                        </Box>
                    ) : null}
                </Box>
            </Box>

            <Box display="flex" className={classes.subView}>
                <Box flexGrow={1} width="100%">
                    <Box display="flex" className={classes.clearContainer}>
                        <Box pl="15px">
                            <ClearButton
                                isDisabled={selectionCounter === 0}
                                qlikAppId={pages.get(PAGE_NAME)}
                            />
                        </Box>

                        <Box flexGrow="1" pl="20px">
                            <QplusSelectionBarDocked
                                color="secondary"
                                cssChipDocked={{
                                    color: theme.palette.text.primary,
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    letterSpacing: 0,
                                    height: "40px",
                                    borderWidth: "0px",
                                    marginRight: "10px",
                                    borderRadius: "4px",
                                    backgroundColor: theme.palette.common.highlight10
                                }}
                                cssChipFixed={{
                                    color: theme.palette.text.primary,
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    letterSpacing: 0,
                                    height: "40px",
                                    borderWidth: "0px",
                                    marginRight: "10px",
                                    borderRadius: "4px",
                                    backgroundColor: theme.palette.common.highlight5
                                }}
                                cssTabs={
                                    name === "compliance" || name === "audit"
                                        ? {
                                              marginBottom: "10px",
                                              width: `${dockedSelectionBarWidth}px`
                                          }
                                        : { width: `${dockedSelectionBarWidth}px` }
                                }
                                tooltipOptions={{
                                    isNative: true
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
                <Box
                    alignSelf="self-end"
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    pb="4px">
                    <Box pr={2}>
                        <QplusUndoButton
                            qlikAppId={pages.get(PAGE_NAME)}
                            classNames={{
                                iconButton: classes.controlButton,
                                iconButtonDisabled: classes.controlButtonDisabled
                            }}
                            isGlobalContext={isMultiAppContext}
                        />
                    </Box>
                    <Box pr={2}>
                        <QplusRedoButton
                            qlikAppId={pages.get(PAGE_NAME)}
                            classNames={{
                                iconButton: classes.controlButton,
                                iconButtonDisabled: classes.controlButtonDisabled
                            }}
                            isGlobalContext={isMultiAppContext}
                        />
                    </Box>
                    <Box pr={2}>
                        <QplusApiBookmarkCreateDialog
                            classNames={{
                                iconButton: classes.controlButton,
                                iconButtonDisabled: classes.controlButtonDisabled
                            }}
                            showPublicToggle={false}
                            showLayoutToggle={false}
                            showPageToggle={false}
                            icon={<BookmarkAddOutlinedIcon />}
                        />
                    </Box>
                    <Box pr={2}>
                        <QplusApiBookmarkListDialog
                            classNames={{ iconButton: classes.controlButton }}
                            icon={<BookmarksOutlinedIcon />}
                            scopedToPath
                        />
                    </Box>

                    {name !== "pinwall" &&
                        name !== "reporting" &&
                        (isLoading ? (
                            <IconButton className={classes.controlButton}>
                                <CircularProgress color="secondary" size={20} />
                            </IconButton>
                        ) : (
                            <QplusFilterDialog
                                defaultFilters={appContext.defaultFilters}
                                qlikAppIds={[pages.get(PAGE_NAME)]}
                                isDisabled={!enableFilters || isLoading}
                                iconNode={
                                    <SvgFilterUserIcon
                                        fill={theme.palette.common.primaryText}
                                        width="24px"
                                        height="24px"
                                    />
                                }
                                classNames={{
                                    iconButton: classes.controlButton
                                }}
                            />
                        ))}
                    {!shouldHideSubSettings ? additionalContent : null}
                </Box>
            </Box>
        </div>
    );
};

export default SubHeaderContent;
