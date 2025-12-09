import React, { FC, useState } from "react";
import { Modal, Box, IconButton, Typography, useTheme } from "@mui/material";
import { FilterAltOff } from "@mui/icons-material";

import { SvgFilterIcon } from "assets/icons";
import { useTranslation } from "react-i18next";
import { QplusClearButton, useQplusBaseUiContext } from "@databridge/qplus";
import FilterList from "./FilterList"; // Adjust the import path as needed
import { translationFiltersView } from "../constants/translations";

const style = {
    position: "absolute",
    top: 0,
    right: 0,
    width: "280px", // Adjust width as needed
    height: "100%",
    bgcolor: "background.paper",
    overflow: "auto" // In case your filters take more space than the screen height
};

interface IFilterDialogProps {
    title: string;
    qlikAppId: string;
    sheetId: string;
}

const FilterDialog: FC<IFilterDialogProps> = ({ qlikAppId, sheetId, title }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { cssFullscreenDialogButtonIcon, cssFullscreenDialogIcon, eraseNode } =
        useQplusBaseUiContext();

    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);

    const { t } = useTranslation();
    const theme = useTheme();

    if (!qlikAppId || !sheetId) return null;

    return (
        <div>
            <IconButton onClick={handleOpen}>
                <SvgFilterIcon color={theme.palette.common.primaryText} width="20" height="20" />
            </IconButton>
            <Modal open={isModalOpen} onClose={handleClose} closeAfterTransition keepMounted>
                <Box sx={style}>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-start"
                        sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                        <Box flexGrow={1} pl={2}>
                            <Typography
                                sx={{
                                    fontSize: "0.875rem",
                                    fontWeight: 600
                                }}>{`${t(translationFiltersView)}`}</Typography>
                        </Box>

                        <Box>
                            <QplusClearButton
                                qlikAppId={qlikAppId}
                                icon={eraseNode}
                                cssIcon={{
                                    ...cssFullscreenDialogIcon
                                }}
                                showWithNoSelections={false}
                                cssButtonIcon={{
                                    bgcolor: "secondary.contrastText",
                                    color: "secondary.main",
                                    "&:hover": {
                                        bgcolor: "secondary.contrastText",
                                        color: "secondary.main"
                                    },
                                    cursor: "pointer",
                                    ...cssFullscreenDialogButtonIcon
                                }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="flex-end" pr={1}>
                            <IconButton onClick={handleClose} size="small" color="primary">
                                <FilterAltOff /> {/* You can change this icon to a close icon */}
                            </IconButton>
                        </Box>
                    </Box>
                    <Box p={2}>
                        <FilterList qlikAppId={qlikAppId} sheetId={sheetId} />
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default FilterDialog;
