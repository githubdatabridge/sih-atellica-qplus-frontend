import React, { useEffect, useMemo } from "react";
import { useMount } from "react-use";
import { Backspace } from "@mui/icons-material";
import {
    QplusPinWall,
    useQplusAppContext,
    useQplusPinWallUiContext,
    useQplusSelectionContext,
    useWindowDimensions
} from "@databridge/qplus";

import { OFFSET_COLLAPSED, OFFSET_EXPANDED } from "app/common/config";
import { useAppContext } from "app/context/AppContext";
import DashboardTemplate from "../shared/components/DashboardTemplate";
import { useStyles } from "./PinwallDashabord.styles";

const PinwallDashboard = React.memo(() => {
    const { isHeaderVisible } = useAppContext();
    const { qAppMap } = useQplusAppContext();
    const { setDockedFields } = useQplusSelectionContext();
    const { setPinwallEraseNode } = useQplusPinWallUiContext();

    const [windowHeight, setWindowHeight] = React.useState<number>(0);
    const { height } = useWindowDimensions();

    const { classes } = useStyles();

    const views = useMemo(
        () => ["Filter", "Favorite", "Erase", "Delete", "Edit", "Clone", "Cancel", "Fullscreen"],
        []
    );

    useMount(async () => {
        for (const [, value] of qAppMap) {
            value?.qApi.clearAll();
        }
        setDockedFields([]);
        setPinwallEraseNode(<Backspace />);
    });

    useEffect(() => {
        setWindowHeight(height - (isHeaderVisible ? OFFSET_EXPANDED : OFFSET_COLLAPSED));
    }, [height, isHeaderVisible]);

    return (
        <DashboardTemplate>
            <QplusPinWall
                views={views}
                height={windowHeight - 45}
                isToolbarWithDivider={false}
                showAppWaterMark
                exportOptions={{
                    types: ["xlsx", "pdf", "png"]
                }}
                classNames={{
                    toolbarIcon: classes.vizToolbarIcon
                }}
            />
        </DashboardTemplate>
    );
});

export default PinwallDashboard;
