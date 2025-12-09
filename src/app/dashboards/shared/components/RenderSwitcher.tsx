import React, { FC, useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { QplusSelectVariable, useQplusGetContentVariable } from "@databridge/qplus";
import { QplusVariable } from "@databridge/qplus-types";

import { useStyles } from "./RenderSwitcher.styles";

interface IRenderSwitcherProps {
    qlikAppId: string;
    variableOption: QplusVariable;
    handleChangeSwitcherValueCallback: (variableName: string, value: string | number) => void;
}

const RenderSwitcher: FC<IRenderSwitcherProps> = ({
    qlikAppId,
    variableOption,
    handleChangeSwitcherValueCallback
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [qVariableOptions, setQVariableOptions] = useState<QplusVariable>(null);

    const { setGetContentVariable } = useQplusGetContentVariable();

    const getVariableContentHelper = useCallback(
        (qlikVariableOptions: QplusVariable) => {
            let qVariable: QplusVariable;
            try {
                setGetContentVariable(
                    qlikVariableOptions.variableName,
                    reply => {
                        const defaultValue = reply?.qContent?.qString?.replace(/'/g, "") || "";
                        qVariable = { ...qlikVariableOptions, defaultValue };
                        setQVariableOptions(qVariable);
                        setIsLoading(false);
                    },
                    qlikAppId
                );
            } catch (error) {
                console.log("SIH Error", error);
            }
        },
        [qlikAppId, setGetContentVariable]
    );
    useEffect(() => {
        setIsLoading(true);
        if (variableOption) getVariableContentHelper(variableOption);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variableOption?.variableName]);

    const { classes } = useStyles();

    if (isLoading || !qVariableOptions) return null;

    return (
        <Box className={classes.toolbarMenu} pr={2}>
            <QplusSelectVariable
                variableOptions={qVariableOptions}
                handleValueChangeCallback={handleChangeSwitcherValueCallback}
                qlikAppId={qlikAppId}
            />
        </Box>
    );
};

export default RenderSwitcher;
