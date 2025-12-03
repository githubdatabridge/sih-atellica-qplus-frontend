import React, { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { makeStyles, withStyles } from 'tss-react/mui'
import { useTheme } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import { Theme } from '@mui/material'
import { QplusSelectVariable, useQplusApp } from '@databridge/qplus'

import { useAppContext } from 'app/context/AppContext'
import useSearchParamsQuery from 'app/shared/hooks/useSearchParamsQuery'
import RenderGridLayout from './RenderGridLayout'

type RenderTabsProp = {
    children: ReactNode
    index: any
    value: any
    page: string
}

const RenderTabs: FC<RenderTabsProp> = ({ children, index, value, page }) => (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`${page}-tabpanel-${index}`}
        aria-labelledby={`${page}-tab-${index}`}>
        {value === index && (
            <Box p={2}>
                <Typography>{children}</Typography>
            </Box>
        )}
    </div>
)

const a11yProps = (tab, page, index) => ({
    id: `${page}-tab-${index}`,
    'aria-controls': `${page}-tabpanel-${index}`,
    label: `${tab}`
})

type PageTabsProp = {
    page: string
    tabs: any[]
}

const PageTabs: FC<PageTabsProp> = ({ tabs, page }) => {
    const {
        searchParams: { view, tab },
        setSearchParams
    } = useSearchParamsQuery()
    const tabIndex = tabs?.findIndex(i => i?.url === tab)
    const currentTabIndex = tabIndex === -1 ? 0 : tabIndex
    const [switchers, setSwitchers] = useState<any[]>(null)
    const [actualTabs, setActualTabs] = useState<any[]>([])
    const theme = useTheme<Theme>()
    const { classes } = useStyles()
    const refValueSwitcher = useRef<Map<string, string>>(new Map())
    const { pages } = useAppContext()
    const { qAppId } = useQplusApp(pages.get(page))

    useEffect(() => {
        const aSwitchers = []
        for (const tab of tabs) {
            aSwitchers.push(tab?.switcher || [])
        }
        setActualTabs(tabs)
        setSwitchers(aSwitchers)
    }, [currentTabIndex, tabs, view])

    const handleChange = (event, newValue) => {
        const tabUrl = actualTabs[newValue].url
        setSearchParams(undefined, tabUrl)
    }

    const handleChangeSwitcherValueCallback = (variableName: string, value: any) => {
        refValueSwitcher.current.set(variableName, value)
    }

    const StyledTabs = withStyles(Tabs, () => ({
        root: {
            background: theme.palette.common.base0,
            boxShadow: 'none'
        },
        indicator: {
            backgroundColor: theme.palette.common.ui2
        },
        scrollButtons: {
            color: theme.palette.common.black
        }
    }))

    const StyledTab = withStyles(
        props => <Tab disableRipple {...props} />,
        () => ({
            root: {
                color: theme.palette.common.secondaryText,
                fontWeight: 600,
                textTransform: 'none'
            },
            selected: {
                textTransform: 'none',
                color: theme.palette.common.primaryText,
                fontWeight: 700
            }
        })
    )

    const renderSwitcher = useMemo(
        () =>
            switchers &&
            switchers[currentTabIndex]?.map((s, index) => {
                const variableOptionsNew = {
                    ...s,
                    defaultValue: refValueSwitcher.current.get(s.variableName) || s.defaultValue
                }
                return (
                    <Box key={`box_${index}`} className={classes.toolbarMenu} pr={2}>
                        <QplusSelectVariable
                            key={`variable_${index}`}
                            variableOptions={variableOptionsNew}
                            handleValueChangeCallback={handleChangeSwitcherValueCallback}
                            qlikAppId={qAppId}
                        />
                    </Box>
                )
            }),
        [classes.toolbarMenu, qAppId, switchers, currentTabIndex]
    )

    const renderTabs = useMemo(() => {
        return actualTabs.map((t, index) => (
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
        ))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actualTabs, view, tab, qAppId])

    return (
        <div className={classes.root}>
            <AppBar position="static" elevation={0} className={classes.appBar}>
                <StyledTabs
                    value={currentTabIndex}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile={true}
                    aria-label="simple tabs example">
                    {actualTabs.map((t, index) => (
                        <StyledTab {...a11yProps(t.title, page, index)} />
                    ))}
                    <Box display="flex" flexGrow={1} alignItems="center" justifyContent="flex-end">
                        {renderSwitcher}
                    </Box>
                </StyledTabs>
            </AppBar>
            {renderTabs}
        </div>
    )
}

export default PageTabs

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        marginLeft: '8px',
        marginRight: '8px',
        marginTop: '20px',
        marginBottom: '8px'
    },
    appBar: {
        borderBottom: '1px solid #ECECEC'
    },
    toolbarMenu: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '44px',
        minWidth: '175px',
        borderLeft: '1px solid #ececec'
    },
    settingsIconButton: {
        '&:hover': {
            cursor: 'pointer'
        }
    }
}))
