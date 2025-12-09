import { useEffect, useMemo, useState } from "react";
import { useMount } from "react-use";
import { Grid, Paper } from "@mui/material";
import { Backspace } from "@mui/icons-material";
import {
    QplusReporting,
    useQplusReportingUiContext,
    useQplusSelectionContext,
    useWindowDimensions
} from "@databridge/qplus";

import { OFFSET_COLLAPSED, OFFSET_EXPANDED } from "app/common/config";
import { useAppContext } from "app/context/AppContext";
import DashboardTemplate from "../shared/components/DashboardTemplate";
import { useStyles } from "./ReportingDashboard.styles";

function ReportingDashboard() {
    const PAGE_NAME = "reporting";
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [qlikAppId, setQlikAppId] = useState<string>("");
    const [windowHeight, setWindowHeight] = useState<number>(0);
    const { height } = useWindowDimensions();
    const { setDockedFields, setMultiAppFields } = useQplusSelectionContext();
    const { isHeaderVisible, pages } = useAppContext();
    const { setReportingEraseNode } = useQplusReportingUiContext();

    const views = useMemo(
        () => [
            "Filter",
            "Comments",
            "ImportExport",
            "Share",
            "Clone",
            "Erase",
            "Reports",
            "Remove",
            "Cancel",
            "Edit",
            "Save"
        ],
        []
    );

    useMount(async () => {
        setIsLoading(true);
        setDockedFields([]);
        setMultiAppFields([]);
        setIsLoading(false);
        setReportingEraseNode(<Backspace />);
    });

    useEffect(() => {
        if (pages) {
            setQlikAppId(pages!.get(PAGE_NAME) || "");
        }
    }, [pages]);

    useEffect(() => {
        setWindowHeight(height - (isHeaderVisible ? OFFSET_EXPANDED : OFFSET_COLLAPSED));
    }, [height, isHeaderVisible]);

    const { classes } = useStyles();

    if (windowHeight === 0 || isLoading) return null;

    return (
        <DashboardTemplate>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Paper className={classes.paper} variant="outlined">
                                <Grid container spacing={0}>
                                    <QplusReporting
                                        height={windowHeight - 85}
                                        views={views}
                                        showSignature={false}
                                        exportOptions={{
                                            types: ["xlsx", "png", "pdf"]
                                        }}
                                        qlikAppId={qlikAppId}
                                        classNames={{
                                            toolbarIcon: classes.vizToolbarIcon
                                        }}
                                    />
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </DashboardTemplate>
    );
}

export default ReportingDashboard;
