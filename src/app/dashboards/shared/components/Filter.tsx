import React, { FC, useCallback, useEffect, useState } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { ArrowDropDown, Close } from "@mui/icons-material";
import { useQlikGetObjectProperties } from "@databridge/qlik-capability-hooks";
import {
    QplusSelectionSingleAppField,
    useQplusFieldClear,
    useQplusSelectionContext
} from "@databridge/qplus";

interface IFilterProp {
    qlikAppId: string;
    qlikObjectId: string;
}

type TFilter = {
    fieldName: string;
    label: string;
};

const Filter: FC<IFilterProp> = ({ qlikAppId, qlikObjectId }) => {
    const [qlikSelectedValues, setQlikSelectedValues] = useState<string>("");
    const [qlikFilter, setQlikFilter] = useState<TFilter>({
        fieldName: "",
        label: ""
    });
    const { setObjectProperties } = useQlikGetObjectProperties();
    const { qIsSelectionMapLoading, qSelectionMap } = useQplusSelectionContext();
    const { setFieldClear } = useQplusFieldClear();

    const fieldNameHelper = qlikFieldName =>
        qlikFieldName.length && qlikFieldName[0] === "=" ? qlikFieldName.slice(1) : qlikFieldName;

    const getObject = useCallback(async () => {
        const fProp = await setObjectProperties(qlikObjectId, qlikAppId);
        const fLayout = await fProp.getLayout();
        const lProp = await setObjectProperties(fLayout.qChildList.qItems[0].qInfo?.qId, qlikAppId);
        const lLayout = await lProp.getLayout();
        if (lLayout) {
            setQlikFilter({
                fieldName: lLayout?.qListObject?.qDimensionInfo?.qGroupFieldDefs[0],
                label:
                    lLayout?.qListObject?.qDimensionInfo?.qFallbackTitle ||
                    lLayout?.qListObject?.qDimensionInfo?.qGroupFallbackTitles?.[0] ||
                    "N/A"
            });
        }
    }, [qlikAppId, qlikObjectId, setObjectProperties]);

    useEffect(() => {
        if (qlikAppId && qlikObjectId) {
            getObject();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qlikAppId, qlikObjectId]);

    useEffect(() => {
        if (!qIsSelectionMapLoading && qlikAppId && qlikFilter?.fieldName) {
            let qSelected = "";
            const fieldName = fieldNameHelper(qlikFilter.fieldName);
            const sMap = qSelectionMap.get(qlikAppId);
            for (const selection of sMap.qSelections) {
                if (selection.fieldName === fieldName) {
                    qSelected = selection.qSelected;
                }
            }
            setQlikSelectedValues(qSelected);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qIsSelectionMapLoading, qSelectionMap, qlikAppId, qlikFilter?.fieldName]);

    const handleClearButtonClick = event => {
        event.preventDefault();
        const fieldName = fieldNameHelper(qlikFilter.fieldName);
        setFieldClear(fieldName, qlikAppId);
    };

    const theme = useTheme();

    if (!qlikFilter.fieldName) return null;

    return (
        <Box display="flex" alignItems="center" justifyContent="center">
            <Box flexGrow={1} alignItems="center">
                <QplusSelectionSingleAppField
                    fieldName={qlikFilter.fieldName}
                    label={qlikFilter.label}
                    qlikAppId={qlikAppId}
                    tooltipOptions={{
                        isNative: true,
                        width: "275px",
                        height: "400px"
                    }}>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-start"
                        mb={2}
                        sx={{
                            color: theme.palette.text.primary,
                            fontSize: "14px",
                            fontWeight: 500,
                            letterSpacing: 0,
                            width: "240px",
                            height: "36px",
                            borderWidth: "0px",
                            borderRadius: 1,
                            backgroundColor: theme.palette.common.highlight10
                        }}>
                        <Box pl={2}>
                            <Typography sx={{ fontSize: "0.825rem", textAlign: "left" }}>
                                {qlikFilter.label}
                            </Typography>
                            {qlikSelectedValues && (
                                <Typography
                                    sx={{
                                        fontSize: "0.625rem",
                                        textAlign: "left",
                                        color: theme.palette.text.primary,
                                        opacity: 0.6,
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        width: "160px"
                                    }}>
                                    {qlikSelectedValues}
                                </Typography>
                            )}
                        </Box>
                        <Box flexGrow="1" pr={1} textAlign="right">
                            {!qlikSelectedValues && <ArrowDropDown />}
                        </Box>
                    </Box>
                </QplusSelectionSingleAppField>
            </Box>
            <Box
                sx={{
                    width: "40px",
                    borderWidth: "0px",
                    marginLeft: "-20px",
                    borderTopRightRadiusRadius: 1,
                    borderBottomRightRadius: 1,
                    backgroundColor: "transparent"
                }}>
                {qlikSelectedValues && (
                    <IconButton
                        onClick={e => handleClearButtonClick(e)}
                        sx={{ width: "16px", height: "16px", marginTop: "-16px" }}>
                        <Close />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
};

export default Filter;
