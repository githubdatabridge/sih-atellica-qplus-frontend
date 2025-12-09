import React from "react";
import { makeStyles } from "tss-react/mui";
import { useTranslation } from "react-i18next";
import { Button, darken, Theme } from "@mui/material";
import { useQplusAppContext, useQplusSelectionContext } from "@databridge/qplus";

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        height: "40px",
        borderRadius: "16px",
        backgroundColor: "transparent",
        border: `1px solid ${theme.palette.common.highlight15}`,
        color: "#000000",
        fontSize: "14px",
        fontWeight: 600,
        letterSpacing: 0,
        lineHeight: "20px",
        boxShadow: "none",
        textTransform: "none",
        minWidth: "138px",
        "&:hover": {
            // you want this to be the same as the backgroundColor above
            backgroundColor: "transparent",
            boxShadow: "none"
        }
    },
    buttonFilter: {
        height: "35px",
        width: "140px",
        maxWidth: "175px",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: "25px",
        backgroundColor: "transparent",
        color: theme.palette.common.primaryText,
        marginTop: "2px",
        fontSize: "14px",
        fontWeight: 600,
        letterSpacing: 0,
        lineHeight: "20px",
        textAlign: "center",
        boxShadow: "none",
        textTransform: "none",
        "&:hover": {
            backgroundColor: theme.palette.common.highlight10,
            boxShadow: "none"
        },
        "&:focus": {
            backgroundColor: "#EBEBEB",
            color: theme.palette.secondary.dark,
            boxShadow: "none"
        }
    },
    buttonDisabled: {
        border: `1px solid ${darken(theme.palette.divider, 0.1)} !important`,
        color: `${darken(theme.palette.text.disabled, 0.2)} !important`,
        opacity: `${1} !important`
    },
    icon: {
        color: "#000000"
    }
}));

interface IClearButtonProps {
    isDisabled: boolean;
    qlikAppId: string;
}

const ClearButton: React.FC<IClearButtonProps> = ({ isDisabled, qlikAppId }) => {
    const { classes } = useStyles();
    const { qAppMap } = useQplusAppContext();
    const { clearSelectionsFromContext } = useQplusSelectionContext();
    const { t } = useTranslation();

    const clearAllHandler = async () => {
        if (qlikAppId) {
            const qApp = qAppMap.get(qlikAppId);
            await qApp?.qApi?.clearAll();
        } else {
            await clearSelectionsFromContext();
        }
    };

    return (
        <Button
            variant="outlined"
            disabled={isDisabled}
            className={classes.root}
            classes={{
                disabled: classes.buttonDisabled
            }}
            onClick={clearAllHandler}>
            {t("sih-subheader-button-clear-selections")}
        </Button>
    );
};

export default ClearButton;
