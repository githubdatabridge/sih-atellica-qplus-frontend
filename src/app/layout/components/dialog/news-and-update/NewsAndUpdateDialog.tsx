import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, Box, DialogContent, useTheme, Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { QplusBaseIconTooltip } from "@databridge/qplus";

import { getCurrentLanguage } from "app/i18n";
import NewsAndUpdateLogo from "./components/NewsAndUpdateLogo";
import NewsAndUpdateHeader from "./components/NewsAndUpdateHeader";
import NewsAndUpdateDetails from "./components/NewsAndUpdateDetails";
import SvgAnnouncement from "./images/SvgAnnouncement";
import SvgCircle from "./images/SvgCircle";
import SvgArrow from "./images/SvgArrow";
import { useStyles } from "./NewsAndUpdateDialog.styles";
import translations from "./constants/translations";
import { RELEASE_NOTES } from "../../../../../releaseNotes";

interface INewsAndUpdateDialogProps {
    open?: boolean;
    handleOnCloseCallback: () => void;
}

const NewsAndUpdateDialog: FC<INewsAndUpdateDialogProps> = ({ open, handleOnCloseCallback }) => {
    const theme = useTheme();
    const { classes } = useStyles();
    const { t } = useTranslation();

    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    const handleCloseDialogClick = async () => {
        setIsOpen(false);
        handleOnCloseCallback();
    };

    const APP_VERSION = import.meta.env.VITE_APP_VERSION || "N/A";

    return (
        <Dialog
            open={isOpen}
            onClose={handleCloseDialogClick}
            PaperProps={{
                style: {
                    minWidth: "800px"
                }
            }}>
            <DialogContent
                sx={{
                    minWidth: "800px",
                    minHeight: "300px",
                    padding: 0,
                    background: theme.palette.info.main
                }}>
                <Box
                    className={classes.content}
                    sx={{
                        background: theme.palette.info.main
                    }}>
                    <Box height="50px" display="flex" position="absolute" top="25px" left="20px">
                        <NewsAndUpdateLogo
                            title={t(translations.dialogLogoTitle)}
                            version={APP_VERSION}
                        />
                    </Box>
                    <Box height="250px" sx={{ marginLeft: "-310px", marginTop: "-30px;" }}>
                        <SvgCircle />
                    </Box>
                    <Box
                        height="200px"
                        display="flex"
                        alignItems="flex-end"
                        position="absolute"
                        bottom="0px"
                        left="0px">
                        <SvgAnnouncement />
                    </Box>
                    <Box
                        height="200px"
                        display="flex"
                        alignItems="flex-end"
                        position="absolute"
                        bottom="0px"
                        right="32px"
                        zIndex={2}>
                        <SvgArrow />
                    </Box>

                    <Box className={classes.main} />
                    <Box className={classes.helper} />
                    <Box className={classes.arrow} />
                    <Box
                        marginLeft={14}
                        sx={{ zIndex: 2, pb: "80px" }}
                        height="inherit"
                        minWidth="100%">
                        <Box width="100%" textAlign="right" sx={{ marginTop: "-20px" }} height="3%">
                            <QplusBaseIconTooltip title="Close">
                                <IconButton onClick={handleCloseDialogClick}>
                                    <Close />
                                </IconButton>
                            </QplusBaseIconTooltip>
                        </Box>
                        <Box pt={2}>
                            <NewsAndUpdateHeader
                                title={t(translations.dialogTitle)}
                                subTitle={t(translations.dialogSubtitle)}
                                paragraph={t(translations.dialogParagraph)}
                            />
                        </Box>
                        <Box>
                            <NewsAndUpdateDetails items={RELEASE_NOTES[getCurrentLanguage()]} />
                        </Box>
                        <Box
                            display="flex"
                            alignItems="center"
                            height="inherit"
                            position="absolute"
                            bottom="20px"
                            width="57%">
                            <Box flexGrow={1} textAlign="right">
                                <Button
                                    onClick={handleCloseDialogClick}
                                    sx={{
                                        background: theme.palette.secondary.main,
                                        color: theme.palette.secondary.contrastText,
                                        ":hover": {
                                            bgcolor: theme.palette.secondary.main,
                                            color: theme.palette.secondary.contrastText
                                        },
                                        minWidth: "120px"
                                    }}>
                                    Close
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default NewsAndUpdateDialog;
