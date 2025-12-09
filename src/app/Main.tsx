import { useMount } from "react-use";
import { Theme } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SuccessIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Error";
import ErrorIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useQplusAlertContext, useQplusBaseUiContext } from "@databridge/qplus";

import RouteApp from "app/dashboards/RouteApp";
import Configurations from "app/shared/components/Configurations";
import SvgEraseIcon from "assets/icons/SvgEraseIcon";

function Main() {
    const {
        setAlertPaperCss,
        setAlertPaperElevation,
        setAlertErrorIcon,
        setAlertInfoIcon,
        setAlertSuccessIcon,
        setAlertWarningIcon
    } = useQplusAlertContext();

    const {
        setFilterNode,
        setDockedNode,
        setEraseNode,
        setCssQlikPanelPaper,
        setCssQlikPanelTypographyTitle,
        setCssQlikPanelTypographySubTitle,
        setCssQlikToolbarExportTypography,
        setCssFullscreenDialogAppBar,
        setCssFullscreenDialogTitle,
        setVizChangeNode,
        setCssActionButton,
        setCssCancelButton,
        setCssDialogPaper,
        setCssDialogAppBar,
        setCssDialogIcon,
        setCssDialogTitle,
        setCssFullscreenDialogButtonIcon
    } = useQplusBaseUiContext();

    const theme = useTheme<Theme>();

    useMount(() => {
        setEraseNode(<SvgEraseIcon fill={theme.palette.secondary.main} />);
        setFilterNode(<ArrowDropDownIcon />);
        setDockedNode(<ArrowDropDownIcon />);
        setVizChangeNode(<AutoGraphIcon style={{ color: theme.palette.primary.dark }} />);
        setCssQlikPanelPaper({
            boxShadow: "0 2px 16px rgb(0 0 0 / 4%)",
            borderRadius: "4px",
            padding: "0px"
        });
        setCssQlikPanelTypographyTitle({
            fontWeight: `${600} !important`,
            color: theme.palette.text.primary,
            textTransform: "none",
            fontSize: "14px !important",
            letterSpacing: 0,
            lineHeight: "20px"
        });
        setCssQlikPanelTypographySubTitle({
            fontWeight: 300,
            color: theme.palette.text.primary,
            textTransform: "none",
            fontSize: "12px !important",
            letterSpacing: 0,
            lineHeight: "20px",
            opacity: 0.6
        });
        setCssQlikToolbarExportTypography({ fontSize: "14px" });
        setCssFullscreenDialogAppBar({
            background: theme.palette.common.base0,
            color: theme.palette.text.primary,
            boxShadow: "none",
            border: `1px solid ${theme.palette.divider}`
        });
        setCssFullscreenDialogTitle({
            color: theme.palette.text.primary
        });
        setCssFullscreenDialogButtonIcon({
            background: theme.palette.common.white,
            color: theme.palette.text.primary
        });

        // Alert notification styling
        setAlertInfoIcon({
            bgColor: theme.palette.common.ui7,
            titleCss: {
                fontWeight: 700,
                fontSize: "16px",
                textTransform: "capitalize"
            },
            contentCss: {
                fontSize: "14px",
                color: theme.palette.common.primaryText
            },
            fillColor: theme.palette.common.ui1,
            icon: (
                <InfoIcon width={24} height={24} style={{ color: theme.palette.common.support5 }} />
            )
        });
        setAlertSuccessIcon({
            bgColor: theme.palette.common.ui7,
            titleCss: {
                fontWeight: 700,
                fontSize: "16px",
                textTransform: "capitalize"
            },
            contentCss: {
                fontSize: "14px",
                color: theme.palette.common.primaryText
            },
            fillColor: theme.palette.common.ui1,
            icon: (
                <SuccessIcon
                    width={24}
                    height={24}
                    style={{ color: theme.palette.common.functionalgreen }}
                />
            )
        });
        setAlertWarningIcon({
            bgColor: theme.palette.common.ui7,
            titleCss: {
                fontWeight: 700,
                fontSize: "16px",
                textTransform: "capitalize"
            },
            contentCss: {
                fontSize: "14px",
                color: theme.palette.common.primaryText
            },
            fillColor: theme.palette.common.ui1,
            icon: (
                <WarningIcon
                    width={24}
                    height={24}
                    style={{ color: theme.palette.common.functionalyellow }}
                />
            )
        });
        setAlertErrorIcon({
            bgColor: theme.palette.common.ui7,
            titleCss: {
                fontWeight: 700,
                fontSize: "16px",
                textTransform: "capitalize"
            },
            contentCss: {
                fontSize: "14px",
                color: theme.palette.common.primaryText
            },
            fillColor: theme.palette.common.ui1,
            icon: (
                <ErrorIcon
                    width={24}
                    height={24}
                    style={{ color: theme.palette.common.functionalred }}
                />
            )
        });
        setAlertPaperElevation(0);
        setAlertPaperCss({ boxShadow: "0 2px 16px rgb(0 0 0 / 10%)" });

        // Dialog styling
        setCssDialogPaper({
            borderRadius: "4px"
        });
        setCssDialogAppBar({
            backgroundColor: theme.palette.common.base0,
            color: theme.palette.common.primaryText,
            boxShadow: "none",
            borderBottom: `1px solid ${theme.palette.common.highlight5}`
        });
        setCssDialogIcon({ color: theme.palette.common.secondaryText });
        setCssActionButton({
            backgroundColor: theme.palette.common.ui3,
            color: theme.palette.common.whiteText,
            borderRadius: "25px"
        });
        setCssCancelButton({
            backgroundColor: theme.palette.common.highlight40,
            color: theme.palette.common.primaryText,
            borderRadius: "25px"
        });
        setCssDialogTitle({
            ...theme.palette.common.header2
        });
    });

    return (
        <Configurations>
            <RouteApp />
        </Configurations>
    );
}

export default Main;
