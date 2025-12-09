import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Button, Typography, useTheme } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { QplusBaseDraggableDialog } from "@databridge/qplus";

import { useStyles } from "./ErrorDialog.styles";

export interface IErrorDialogProps {
    isOpen: boolean;
    title: string;
    primaryText: string;
    secondaryText: string;
    buttonText: string;
    closeTooltipText: string;
    handleCloseCallback?: (isOpen: boolean) => void;
}

export const ErrorDialog: FC<IErrorDialogProps> = ({
    isOpen,
    title,
    primaryText,
    secondaryText,
    buttonText,
    closeTooltipText,
    handleCloseCallback
}) => {
    const { classes } = useStyles();
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // @ts-expect-error Type instantiation is excessively deep and possibly infinite.ts
    const { t } = useTranslation();

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    const handleClose = () => {
        setOpen(false);
        setIsLoading(false);
        if (handleCloseCallback) handleCloseCallback(false);
    };

    const theme = useTheme();

    return open ? (
        <QplusBaseDraggableDialog
            dismissDialogCallback={handleClose}
            closeTooltipText={t(closeTooltipText)}
            title={t(title)}
            hideBackdrop={false}
            cssPaper={{ minHeight: "450px" }}>
            <Box width="100%" height="100%">
                <Box p={1} textAlign="center">
                    <ErrorIcon
                        style={{ width: 150, height: 150, color: theme.palette.info.dark }}
                    />
                </Box>
                <Box p={1} textAlign="center">
                    <Box>
                        <Typography
                            color="primary"
                            variant="h5"
                            className={classes.permissionTitle}>
                            {t(primaryText)}
                        </Typography>
                    </Box>
                    <Box p={1}>
                        <Typography
                            color="primary"
                            component="span"
                            className={classes.permissionDescription}>
                            {t(secondaryText)}
                        </Typography>
                    </Box>
                </Box>
                <Box
                    mb={4}
                    mt={2}
                    display="flex"
                    justifyContent="center"
                    className={classes.buttonBox}>
                    <Button
                        onClick={handleClose}
                        className={classes.buttonAction}
                        disabled={isLoading}>
                        {t(buttonText)}
                    </Button>
                </Box>
            </Box>
        </QplusBaseDraggableDialog>
    ) : null;
};

export default ErrorDialog;
