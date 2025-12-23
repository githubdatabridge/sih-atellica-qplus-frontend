import React, { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ArrowOutward } from "@mui/icons-material";
import ButtonBase from "@mui/material/ButtonBase";
import { QplusVisualizationEmbed, useQplusGetContentVariable } from "@databridge/qplus";
import { QplusVariable } from "@databridge/qplus-types";

import useSearchParamsQuery from "app/shared/hooks/useSearchParamsQuery";
import { LayoutView } from "app/shared/models/LayoutView";
import { useStyles } from "./RenderGridLayout.styles";

type ExportFormat = "xlsx" | "png" | "pdf";

type Column = {
    grid?: Column[];
    title?: string;
    view?: string;
    tab?: string;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    id: string;
    height?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variableOptions?: any;
    calculationCondition?: string;
    isFilter?: boolean;
    export?: ExportFormat[];
    showTitles?: boolean;
    isPanelVisible?: boolean;
};

type RenderGridLayoutProps = {
    qlikAppId?: string;
    content: LayoutView[][];
};

interface RenderGridHeaderProps {
    col: Column;
}

const RenderGridHeader: FC<RenderGridHeaderProps> = ({ col }) => {
    const { classes } = useStyles();
    const { setSearchParams } = useSearchParamsQuery();

    const handleButtonClick = () => {
        if (col?.view) {
            setSearchParams(col.view, col.tab || undefined);
        }
    };

    return (
        <ButtonBase onClick={handleButtonClick} className={classes.gridHeader}>
            <Typography className={classes.gridHeaderTypography} title={col?.title}>
                {col?.title}
            </Typography>
            {col?.view && <ArrowOutward style={{ marginRight: -4 }} />}
        </ButtonBase>
    );
};

const RenderGridItem: FC<{ col: Column; qlikAppId: string }> = ({ col, qlikAppId }) => {
    const [qVariableOptions, setQVariableOptions] = useState<QplusVariable[]>([]);
    const { classes } = useStyles();

    const { setGetContentVariable } = useQplusGetContentVariable();

    const getVariableContentHelper = useCallback((variableOptions: QplusVariable[]) => {
        const qVariables: QplusVariable[] = [];
        try {
            for (let index = 0; index < variableOptions.length; index += 1) {
                setGetContentVariable(variableOptions[index].variableName, reply => {
                    const defaultValue = reply?.qContent?.qString?.replace(/'/g, "") || "";
                    qVariables.push({ ...variableOptions[index], defaultValue });
                    if (index === variableOptions.length - 1) {
                        setQVariableOptions(qVariables);
                    }
                });
            }
        } catch (error) {
            console.log("SIH Error", error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (col?.variableOptions?.length > 0) {
            getVariableContentHelper(col?.variableOptions);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const visualizationOptions = useMemo(
        () => ({
            id: col.id,
            qlikAppId,
            height: col.height,
            titleOptions: {
                disableQlikNativeTitles: true,
                useQlikTitlesInPanel: true,
                useQlikFooterInFooter: false
            },
            enableFullscreen: !col.isFilter,
            isToolbarOnPanel: !col.isFilter,
            calculation: { condition: col.calculationCondition || "" },
            ...(col.export ? { exportOptions: { types: col.export } } : {}),
            classNames: {
                toolbarIcon: classes.toolbarIcon
            }
        }),
        [
            classes.toolbarIcon,
            col.calculationCondition,
            col.export,
            col.height,
            col.id,
            col.isFilter,
            qlikAppId
        ]
    );

    return (
        <Grid
            item
            xs={col.xs}
            sm={col.sm}
            md={col.md}
            lg={col.lg}
            xl={col.xl}
            className={col.isFilter ? classes.gridFilter : classes.gridNestedDetail}>
            {col?.tab && <RenderGridHeader col={col} />}
            {col?.id && (
                <QplusVisualizationEmbed
                    key={`viz-embed-${col.id}`}
                    panelOptions={{
                        variableOptions: qVariableOptions,
                        showTitles: col?.showTitles ?? true,
                        classNames: {
                            actions: !(col?.isPanelVisible ?? true) ? classes.vizHeaderActions : ""
                        }
                    }}
                    visualizationOptions={visualizationOptions}

                />
            )}
        </Grid>
    );
};

const RenderGridLayout: FC<RenderGridLayoutProps> = memo(({ qlikAppId = "", content }) => {
    const { classes } = useStyles();

    const renderGridRow = (row: Column[], i: number) => (
        <Grid container key={`grid-container-${i}`} sx={{ mt: 1 }}>
            {row?.map((col, j) =>
                col?.grid ? (
                    <Grid
                        key={`grid-${j}`}
                        item
                        xs={row[j]?.xs || 12}
                        sm={row[j]?.sm || 12}
                        md={row[j]?.md || 12}
                        lg={row[j]?.lg || 12}
                        xl={row[j]?.xl || 12}
                        className={classes.grid}>
                        <Grid
                            container
                            key={`grid-column-container-${i}`}
                            sx={{ display: "flex", flexDirection: "column" }}>
                            {col?.title && <RenderGridHeader col={col} />}
                            <div style={{ display: "flex", flexWrap: "wrap" }}>
                                {col?.grid?.map((nestedCol, colIndex) => (
                                    <RenderGridItem
                                        key={`grid-col-${colIndex}`}
                                        col={nestedCol}
                                        qlikAppId={qlikAppId}
                                    />
                                ))}
                            </div>
                        </Grid>
                    </Grid>
                ) : (
                    <RenderGridItem key={`grid-col-${j}`} col={col} qlikAppId={qlikAppId} />
                )
            )}
        </Grid>
    );

    return content?.map(renderGridRow) as unknown as JSX.Element;
});

export default RenderGridLayout;
