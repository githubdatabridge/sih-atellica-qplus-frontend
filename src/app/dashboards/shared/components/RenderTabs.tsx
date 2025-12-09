/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { withStyles } from "tss-react/mui";
import { AppBar, Box, Tab, TabScrollButton, Tabs, Theme } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useQplusApp } from "@databridge/qplus";

import { useAppContext } from "../../../context/AppContext";
import useSearchParamsQuery from "../../../shared/hooks/useSearchParamsQuery";
import RenderGridLayout from "./RenderGridLayout";
import { useStyles } from "./RenderTabs.styles";
import RenderSwitcher from "./RenderSwitcher";
import FilterDialog from "./FilterDialog";

/*
!!!! we need to import QVariable and QVariableEnum types to correctly type this component!
*/

type RenderTabsProp = {
    children: ReactNode;
    index: any;
    value: any;
    page: string;
};

const RenderTabs: FC<RenderTabsProp> = ({ children, index, value, page }) => (
    <div
        role="tabpanel"
        hidden={value !== index}
        key={`${page}-tabpanel-${index}`}
        id={`${page}-tabpanel-${index}`}
        aria-labelledby={`${page}-tab-${index}`}>
        {value === index && <Box p={2}>{children}</Box>}
    </div>
);

const a11yProps = (tab, page, index) => ({
    key: `${page}-tab-${index}-key`,
    id: `${page}-tab-${index}`,
    "aria-controls": `${page}-tabpanel-${index}`,
    label: `${tab}`
});

type PageTabsProp = {
    page: string;
    tabs: any[];
};

const PageTabs: FC<PageTabsProp> = ({ tabs, page }) => {
    const {
        searchParams: { view, tab },
        setSearchParams
    } = useSearchParamsQuery();

    const tabIndex = tabs?.findIndex(i => i?.url === tab);
    const currentTabIndex = tabIndex === -1 ? 0 : tabIndex;

    const theme = useTheme<Theme>();
    const { classes } = useStyles();

    const { pages } = useAppContext();
    const { qAppId } = useQplusApp(pages.get(page));

    const [sheets, setSheets] = useState<string[]>([]);
    const [switchers, setSwitchers] = useState<any[]>(null);
    const [actualTabs, setActualTabs] = useState<any[]>([]);
    const refValueSwitcher = useRef<Map<string, string | number>>(new Map());

    const handleChange = (event, newValue) => {
        const tabUrl = actualTabs[newValue].url;
        setSearchParams(undefined, tabUrl);
    };

    const handleChangeSwitcherValueCallback = (variableName: string, value: string | number) => {
        refValueSwitcher.current.set(variableName, value);
    };

    const StyledTabs = withStyles(Tabs, () => ({
        root: {
            background: theme.palette.common.base0,
            boxShadow: "none"
        },
        indicator: {
            backgroundColor: theme.palette.common.ui2
        },
        scrollButtons: {
            color: theme.palette.common.black
        }
    }));

    const MyTabScrollButton = withStyles(TabScrollButton, () => ({
        root: {
            width: 40,
            overflow: "hidden",
            transition: "width 0.5s",
            "&.Mui-disabled": {
                width: 0
            }
        }
    }));

    const StyledTab = withStyles(
        props => <Tab disableRipple {...props} />,
        () => ({
            root: {
                color: theme.palette.common.secondaryText,
                fontWeight: 600,
                textTransform: "none",
                minWidth: 135
            },
            selected: {
                textTransform: "none",
                color: theme.palette.common.primaryText,
                fontWeight: 700
            }
        })
    );

    const renderSwitcher = useMemo(
        () =>
            switchers &&
            switchers[currentTabIndex]?.map((s, index) => (
                <RenderSwitcher
                    key={`switcher_${index}`}
                    variableOption={s}
                    handleChangeSwitcherValueCallback={handleChangeSwitcherValueCallback}
                    qlikAppId={qAppId}
                />
            )),
        [qAppId, switchers, currentTabIndex]
    );

    const renderFilters = useMemo(
        () =>
            qAppId &&
            sheets &&
            sheets[currentTabIndex] && (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                    height="100%"
                    sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                    <FilterDialog
                        sheetId={sheets[currentTabIndex]}
                        qlikAppId={qAppId}
                        title={actualTabs[currentTabIndex].title}
                    />
                </Box>
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [qAppId, sheets, actualTabs, currentTabIndex]
    );

    const renderTabs = useMemo(
        () =>
            actualTabs.map((t, index) => (
                <RenderTabs
                    key={`${view}_${tab}_${index}_tab`}
                    value={currentTabIndex}
                    index={index}
                    page={page}>
                    <RenderGridLayout
                        key={`${view}_${tab}_${index}_layout`}
                        content={t?.layout}
                        qlikAppId={qAppId}
                    />
                </RenderTabs>
            )),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [actualTabs, view, tab, qAppId]
    );

    const renderActualTabs = useMemo(
        // eslint-disable-next-line react/jsx-key
        () => actualTabs.map((t, index) => <StyledTab {...a11yProps(t.title, page, index)} />),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [actualTabs, page]
    );

    useEffect(() => {
        const qSwitchers = [];
        const qSheets = [];
        for (const tabElement of tabs) {
            qSheets.push(tabElement?.sheetId || "");
            qSwitchers.push(tabElement?.switcher || []);
        }
        setActualTabs(tabs);
        setSwitchers(qSwitchers);
        setSheets(qSheets);
        // eslint-disable-next-line no-sparse-arrays
    }, [currentTabIndex, , tabs, view]);

    return (
        <div className={classes.root}>
            <AppBar position="static" elevation={0} className={classes.appBar}>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bgcolor={theme.palette.common.white}>
                    <StyledTabs
                        value={currentTabIndex}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        ScrollButtonComponent={MyTabScrollButton}
                        aria-label="simple tabs example">
                        {renderActualTabs}
                    </StyledTabs>
                    <Box display="flex" flexGrow={1} alignItems="center" justifyContent="flex-end">
                        {renderSwitcher}
                        {renderFilters}
                    </Box>
                </Box>
            </AppBar>
            {renderTabs}
        </div>
    );
};

export default PageTabs;
