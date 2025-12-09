import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Theme, Badge } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";

import { QplusBaseIconTooltip } from "@databridge/qplus";

import SvgHelpIcon from "assets/icons/SvgHelpIcon";
import { useStyles } from "./HelpBadge.styles";
import NewsAndUpdateDialog from "../dialog/news-and-update/NewsAndUpdateDialog";

function NotificationCenter() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const theme = useTheme<Theme>();
    const { classes } = useStyles();

    const [iconColor, setIconColor] = React.useState<string>(
        theme?.palette.common.secondaryText || ""
    );
    const { t } = useTranslation();

    const handleOnMouseLeave = () => {
        setIconColor(theme?.palette.common.secondaryText || "");
    };

    const handleOnMouseEnter = () => {
        setIconColor(theme?.palette.common.primaryText || "");
    };

    const handleOnCloseCallback = () => {
        setIsOpen(false);
    };

    const APP_VERSION = import.meta.env.VITE_APP_VERSION || "N/A";

    return (
        <>
            <QplusBaseIconTooltip
                title={`${t("sih-header-control-info-tooltip")} - ${APP_VERSION}`}>
                <ButtonBase
                    className={classes.button}
                    onMouseEnter={handleOnMouseEnter}
                    onMouseLeave={handleOnMouseLeave}
                    onClick={() => setIsOpen(true)}>
                    <Badge classes={{ badge: classes.customBadge }} variant="dot">
                        <SvgHelpIcon fill={iconColor} />
                    </Badge>
                </ButtonBase>
            </QplusBaseIconTooltip>
            <NewsAndUpdateDialog open={isOpen} handleOnCloseCallback={handleOnCloseCallback} />
        </>
    );
}

export default React.memo(NotificationCenter);
