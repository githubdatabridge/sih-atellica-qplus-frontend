import React, { ChangeEvent, ReactNode, useCallback, useEffect, useState } from 'react'

import { useMediaQuery } from 'react-responsive'
import { useNavigate } from 'react-router-dom'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import NoIcon from '@mui/icons-material/TroubleshootOutlined'
import { darken, Divider, IconButton, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import { alpha, Theme, useTheme } from '@mui/material/styles'
import Tab from '@mui/material/Tab'

import { makeStyles } from 'tss-react/mui'

import { useQuery } from '@libs/common-hooks'
import { useBaseUiContext } from '@libs/common-providers'
import { IconTooltip, R } from '@libs/common-ui'
import { useQlikGetObjectProperties } from '@libs/qlik-capability-hooks'
import { QlikActionsProvider, QlikTitleProvider, useQlikApp } from '@libs/qlik-providers'

import { QlikSocialBar } from '../../social/QlikSocialBar'
import { useQlikVisualizationContext } from '../../visualizations/QlikVisualizationContext'
import QlikVisualizationCore from '../../visualizations/QlikVisualizationCore'
import QlikToolbarExport from '../../visualizations/toolbar/QlikToolbarExport'
import QlikToolbarFullscreen from '../../visualizations/toolbar/QlikToolbarFullscreen'
import QlikToolbarInfo from '../../visualizations/toolbar/QlikToolbarInfo'
import QlikToolbarVizTypes from '../../visualizations/toolbar/QlikToolbarVizTypes'
import QlikVisualizationTabContent from '../QlikVisualizationTabContent'
import { IVisualizationTabsPanelProps, VisualizationType } from '../QlikVisualizationTabs'
import QlikVisualizationTabsVertical from '../QlikVisualizationTabsVertical'

const a11yProps = (index: number) => ({
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`
})

const useQlikVisualizationTabsConfiguration = ({
    enableSocialBar,
    visualizations,
    compactTabs,
    tabOptions,
    tabStyling,
    hasToggle,
    scrollButtons,
    indicator,
    onChanged,
    qlikAppId,
    vertical
}: IVisualizationTabsPanelProps) => {
    const theme = useTheme()
    const border = `1px solid ${theme.palette.divider}`
    const borderDarker = `1px solid ${darken(theme.palette.divider, 0.5)}`
    const [isVertical, setIsVertical] = useState<boolean>(vertical)
    const [tabsContent, setTabsContent] = useState<any[]>([])
    const [value, setValue] = useState<number>(0)
    const { cssQlikPanelPaper, cssQlikToolbar } = useBaseUiContext()
    const navigate = useNavigate()
    const queryParams = useQuery()
    const visComponentIdQuery = queryParams.get('v') || ''
    const visComponentTabValue = queryParams.get('t') || ''
    const { qAppId } = useQlikApp(qlikAppId)
    const { setObjectProperties } = useQlikGetObjectProperties()
    const { visualizationId, showVisualization, setVisualizationType } =
        useQlikVisualizationContext()
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | HTMLDivElement | null>(null)
    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined
    const isTablet = useMediaQuery({ query: '(max-width: 650px)' })

    const renderTabText = useCallback(
        (id: string, maxLength = 40): string => {
            const { title, subtitle } = tabsContent?.find(x => x.id === id) || {}
            const tooltipText = title || subtitle || ''

            return tooltipText.length > maxLength
                ? tooltipText.substring(0, maxLength) + '...'
                : tooltipText
        },
        [tabsContent]
    )

    const useTabStylesFromProps = makeStyles()(() => ({
        tabActive: {
            color: `${tabStyling?.activeColor || theme.palette.text.primary} !important`,
            backgroundColor: `${tabStyling?.activeBackgroundColor || 'transparent'} !important`,
            svg: {
                fill: `${tabStyling?.activeIconColor} !important` || 'inherit'
            }
        },
        tabInActive: {
            color: `${tabStyling?.inactiveColor || theme.palette.text.primary} !important`,
            backgroundColor: `${tabStyling?.inactiveBackgroundColor || '#EDEDED'} !important`,
            svg: {
                fill: `${tabStyling?.inactiveIconColor || 'inherit'} !important`
            }
        }
    }))

    const { classes: tabStylesOverride } = useTabStylesFromProps()
    const { classes } = useStyles()

    const tabConfiguration = {
        headingWidth: compactTabs ? 'auto' : '100%',
        toolbarBorderBottom: compactTabs ? 'none !important' : 'inherit',
        tabIndicatorDisplay: compactTabs ? 'none' : 'block',
        tabCompactHeight: compactTabs ? '50px' : '60px',
        tabCompactWidth: compactTabs ? '50px' : '50px',
        tabCompactLabel: (tab: VisualizationType, index: number) =>
            compactTabs ? undefined : renderTabLabel(tab, index === value),
        tabCompactClasses: (index: number) =>
            index === value
                ? `${tabStylesOverride.tabActive} ${classes.tabActive} ${tabOptions?.classNames?.tabActive}`
                : ` ${tabStylesOverride.tabInActive} ${classes.tabInActive} ${tabOptions?.classNames?.tabInActive}`,
        tabCompactStyle: compactTabs && {
            minWidth: '50px',
            maxWidth: '50px',
            borderRight: isVertical && tabStyling.hasBorder ? border : 'none'
        },
        tabCompactCurrentTitle: compactTabs && (
            <Box
                display="flex"
                alignItems="center"
                px={isVertical ? '8px' : '24px'}
                title={renderTabText(visualizations[value]?.visualizationOptions?.id, 100)}>
                <Typography
                    className={`${classes.tabActiveTypography} ${
                        tabOptions?.classNames?.tabActiveTypography || ''
                    }`}>
                    {renderTabText(visualizations[value]?.visualizationOptions?.id, 100) || ''}
                </Typography>
            </Box>
        ),
        compactTabIcon: compactTabs ? <NoIcon /> : null,
        compactTabVerticalLabel: (label: ReactNode) => (compactTabs ? undefined : label)
    }

    useEffect(() => {
        void (async () => {
            const objs = []
            for (const vis of visualizations) {
                let l: { title: string; subtitle: string },
                    o = null
                if (vis.visualizationOptions?.titleOptions?.useQlikTitlesInPanel) {
                    o = await setObjectProperties(vis.visualizationOptions.id, qAppId)
                    l = await o?.getLayout()
                }
                objs.push({
                    id: vis.visualizationOptions.id,
                    title: l?.title || vis?.title || '',
                    subtitle: l?.subtitle || vis?.subtitle || ''
                })
            }
            setTabsContent(objs)
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visualizations])

    useEffect(() => {
        if (!visComponentTabValue) return
        const findViz = visualizations?.find(
            () =>
                visComponentIdQuery ===
                visualizations[visComponentTabValue]?.visualizationOptions?.id
        )
        if (!findViz) return
        setValue(parseInt(visComponentTabValue))
    }, [visComponentIdQuery, visComponentTabValue, visualizations])

    const indicatorColorHandler = (theme?: Theme) =>
        indicator?.color
            ? theme.palette[indicator.color]?.main || indicator.color
            : theme.palette.secondary.main

    const indicatorStyles = makeStyles()((theme: Theme) => ({
        indicator: {
            height: indicator?.height || '3px',
            top: indicator?.position === 'top' ? '0px' : null,
            bottom: indicator?.position === 'bottom' ? '0px' : null,
            backgroundColor: indicatorColorHandler(theme),
            display: tabConfiguration.tabIndicatorDisplay
        },
        tabInfoVariant: {
            borderRadius: '50px',
            backgroundColor: indicatorColorHandler(theme),
            width: '6px',
            height: '6px'
        }
    }))

    const generateTabStyles = (minWidth: string, maxWidth: string, fontSize: string) =>
        makeStyles()(() => ({
            tabsRoot: {
                minHeight: '50px',
                height: '50px'
            },
            tabsScroller: {},
            root: {
                minHeight: '50px',
                height: '50px',
                minWidth: minWidth ?? '250px',
                '@media (max-width: 760px)': {
                    minWidth: maxWidth ?? '250px',
                    maxWidth: '300px',
                    lineHeight: 1
                },
                '@media (max-width: 550px)': {
                    minWidth: '190px',
                    maxWidth: '250px'
                },
                '@media (max-width: 400px)': {
                    minWidth: '135px',
                    maxWidth: '145px'
                },
                '@media (max-width: 350px)': {
                    minWidth: '115px',
                    maxWidth: '125px'
                },
                '@media (max-width: 300px)': {
                    minWidth: '70px',
                    maxWidth: '90px'
                },
                fontSize: fontSize ?? '15px'
            },
            rootVertical: {
                minWidth: '225px',
                minHeight: tabConfiguration.tabCompactHeight,
                alignSelf: 'end',
                fontSize: fontSize ?? '15px',
                width: '100%',
                '@media (max-width: 1700px)': {
                    minWidth: '175px'
                },
                '@media (max-width: 1100px)': {
                    minWidth: '100%'
                },
                '@media (max-width: 960px)': {
                    fontSize: '14px'
                },
                '@media (max-width: 760px)': {
                    fontSize: '13.5px'
                }
            }
        }))

    const tabStyle = generateTabStyles(
        tabOptions?.cssTab?.width,
        tabOptions?.cssTab?.maxWidth,
        '15px'
    )

    const tabDropDownStyle = generateTabStyles(tabOptions?.cssTab?.width, '300px', '15px')

    const { classes: classesIndicator } = indicatorStyles()
    const { classes: classesTab } = tabStyle()
    const { classes: classesDropdownTab } = tabDropDownStyle()

    const handleChange = (_event: ChangeEvent<any>, newValue: number) => {
        const findViz = visualizations.find(
            v => v.visualizationOptions.id === visualizations[newValue]?.visualizationOptions?.id
        )
        if (newValue >= 0 && findViz) {
            if (onChanged) onChanged(newValue)
            setVisualizationType('')
            const urlParams = new URLSearchParams(window.location.search)

            urlParams.set('t', `${newValue}`)
            urlParams.set('v', findViz.visualizationOptions.id)

            navigate(`?${urlParams}`, { replace: true })
            setValue(newValue)
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) =>
        setAnchorEl(event.currentTarget)

    const handleClose = () => setAnchorEl(null)

    const renderVariantTooltipText = useCallback(
        (id: string, isTitle = true, isSubtitle = false): string => {
            const { title, subtitle } = tabsContent?.find(x => x.id === id) || {}
            return (isTitle && title) || (isSubtitle && subtitle) || ''
        },
        [tabsContent]
    )

    const ToggleButton = (props: any) => (
        <Box {...props} alignSelf="center">
            <IconButton onClick={() => setIsVertical(!isVertical)}>
                {isVertical ? (
                    <SwapHorizIcon style={{ fill: theme.palette.text.primary }} />
                ) : (
                    <ImportExportIcon style={{ fill: theme.palette.text.primary }} />
                )}
            </IconButton>
        </Box>
    )

    const toolbarComponentsRender = visualizations?.map((v, index) => {
        const {
            visualizationOptions: {
                typeOptions: { types: vizTypes = [] } = {},
                infoOptions: { title = '', text = '', color: infoColor = 'primary' } = {},
                exportOptions: { types: exportTypes = [], color: exportColor = 'primary' } = {},
                isToolbarOnPanel,
                enableFullscreen
            } = {}
        } = v

        const showVisualizationToolbar = showVisualization && (isToolbarOnPanel ?? true)

        if (index !== value || !showVisualizationToolbar) return null

        const toolbarComponents = [
            {
                Component: QlikToolbarVizTypes,
                show: vizTypes.length > 0,
                props: { types: vizTypes, css: { marginTop: '2px' } }
            },
            {
                Component: QlikToolbarInfo,
                show: Boolean(title || text),
                props: { title, text, color: infoColor }
            },
            {
                Component: QlikToolbarExport,
                show: exportTypes.length > 0,
                props: { color: exportColor, types: exportTypes }
            },
            {
                Component: QlikToolbarFullscreen,
                show: enableFullscreen ?? true,
                props: { title: 'Fullscreen' }
            },
            {
                Component: ToggleButton,
                show: !isTablet && hasToggle && !isVertical,
                props: null
            }
        ]

        return (
            <div key={index} style={{ display: 'contents' }}>
                {toolbarComponents
                    .filter(({ show }) => show)
                    .map(({ Component, props }, boxIndex) => (
                        <Box
                            className={`${classes.toolbarMenu} ${tabOptions?.classNames?.toolbarMenu}`}
                            style={{
                                ...cssQlikToolbar,
                                borderLeft: tabStyling.hasBorder ? border : 'none',
                                borderRight: tabStyling.hasBorder ? border : 'none',
                                borderTop: tabStyling.hasBorder ? border : 'none',
                                borderBottom: tabStyling.hasBorder ? border : 'none'
                            }}
                            key={`box-${boxIndex + 1}-${index}`}>
                            <Component {...props} />
                        </Box>
                    ))}
            </div>
        )
    })

    const toolbarComponent = (
        <Box
            display="flex"
            flexGrow={1}
            alignItems="center"
            justifyContent="flex-end"
            height="50px">
            {toolbarComponentsRender}
        </Box>
    )

    const renderTabLabel = (tab: VisualizationType, active: boolean) => {
        const {
            visualizationOptions: { id },
            maxLength
        } = tab
        const tooltipTitle = renderVariantTooltipText(id, active, !active) || ''

        return (
            <Box display="flex">
                <Box flexGrow={1}>
                    <IconTooltip title={tooltipTitle}>
                        <Typography
                            classes={{
                                root: active
                                    ? `${classes.tabActiveTypography} ${
                                          tabOptions?.classNames?.tabActiveTypography || ''
                                      }`
                                    : `${classes.tabInActiveTypography} ${
                                          tabOptions?.classNames?.tabInActiveTypography || ''
                                      }`
                            }}>
                            {renderTabText(id, maxLength) || ''}
                        </Typography>
                    </IconTooltip>
                </Box>
                {renderVariantTooltipText(id, false, true) && (
                    <Box ml={1}>
                        <IconTooltip title={renderVariantTooltipText(id)}>
                            <Box
                                className={classesIndicator.tabInfoVariant}
                                style={{
                                    backgroundColor: active
                                        ? null
                                        : alpha(theme.palette.text.primary, 0.2)
                                }}
                            />
                        </IconTooltip>
                    </Box>
                )}
            </Box>
        )
    }

    const renderTabLabels = isTablet ? (
        <>
            <Tab
                label={renderTabLabel(visualizations[value], true)}
                onClick={handleClick}
                sx={{
                    borderTop: `3px solid ${indicatorColorHandler(theme)}`,
                    opacity: 0.6,
                    ...tabOptions?.cssTabDropdown
                }}
                classes={{
                    root: classesDropdownTab.root,
                    iconWrapper: `${!compactTabs ? classes.tabIconWrapper : ''} ${
                        tabOptions?.classNames?.tabActiveIconWrapper
                    }`
                }}
                className={`${classes.tabDropdownActive} ${tabOptions?.classNames?.tabDropdownActive}`}
            />
            <Box onClick={handleClick}>
                <ExpandMoreIcon
                    fontSize="small"
                    color="primary"
                    sx={{
                        borderTop: `3px solid ${indicatorColorHandler(theme)}`,
                        height: '49px',
                        opacity: 0.6,
                        ...tabOptions?.cssTabDropdownIcon
                    }}
                />
            </Box>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                classes={{
                    paper: classes.popover
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}>
                {visualizations.map((tab, index) => (
                    <Tab
                        label={renderTabLabel(tab, index === value)}
                        {...a11yProps(index)}
                        classes={{
                            root: classesDropdownTab.root
                        }}
                        className={
                            index === value ? classes.popoverActive : classes.popoverInActive
                        }
                        icon={tab.icon || null}
                        iconPosition={tab.iconPosition}
                        style={{ ...tab.css }}
                        onClick={e => handleChange(e, index)}
                    />
                ))}
            </Popover>
        </>
    ) : (
        visualizations.map((tab, index) => (
            <Tab
                label={tabConfiguration.tabCompactLabel(tab, index)}
                {...a11yProps(index)}
                key={`${tab.visualizationOptions.id}-${index}`}
                classes={{
                    root: `${classesTab.root} ${tabOptions?.classNames?.tabRoot}`,
                    iconWrapper: `${!compactTabs ? classes.tabIconWrapper : ''}
                        ${
                            index === value
                                ? tabOptions?.classNames?.tabActiveIconWrapper
                                : tabOptions?.classNames?.tabInActiveIconWrapper
                        }`
                }}
                className={tabConfiguration.tabCompactClasses(index)}
                icon={
                    compactTabs ? (
                        <IconTooltip
                            title={
                                renderVariantTooltipText(
                                    tab.visualizationOptions.id,
                                    true,
                                    false
                                ) || ''
                            }>
                            {tab.icon || tabConfiguration.compactTabIcon}
                        </IconTooltip>
                    ) : (
                        tab.icon || tabConfiguration.compactTabIcon
                    )
                }
                iconPosition={tab.iconPosition}
                style={{
                    display: isVertical ? 'none' : '',
                    ...tab?.css,
                    ...tabConfiguration.tabCompactStyle,
                    borderLeft: tabStyling.hasBorder ? border : 'none',
                    borderRight: tabStyling.hasBorder ? border : 'none',
                    borderTop: tabStyling.hasBorder ? border : 'none',
                    borderBottom: tabStyling.hasBorder ? border : 'none'
                }}
                onClick={e => handleChange(e, index)}
            />
        ))
    )

    const VerticalTabs = () => {
        if (!isVertical) return null

        return (
            <QlikVisualizationTabsVertical
                value={value || 0}
                scrollButtons={scrollButtons}
                onChange={handleChange}
                isVisible={isVertical && !isTablet}
                classIndicator={classesIndicator?.indicator || ''}
                classScrollButtons={tabOptions?.classNames?.tabScrollButton || ''}
                classScroller={tabOptions?.classNames?.tabsScroller || ''}>
                {visualizations.map((tab, index) => (
                    <Tab
                        key={`${tab.visualizationOptions.id}-${index}`}
                        label={tabConfiguration.compactTabVerticalLabel(
                            <Box display="flex">
                                <Box flexGrow={1}>
                                    <IconTooltip
                                        title={
                                            renderVariantTooltipText(
                                                tab.visualizationOptions.id,
                                                true,
                                                false
                                            ) || ''
                                        }>
                                        <span
                                            className={
                                                index !== value
                                                    ? `${classes.verticalInactive} ${tabOptions?.classNames?.tabVerticalInactive}`
                                                    : `${classes.verticalActive} ${tabOptions?.classNames?.tabVerticalActive}`
                                            }>
                                            {renderTabText(
                                                tab.visualizationOptions.id,
                                                tab?.maxLength
                                            ) || ''}
                                        </span>
                                    </IconTooltip>
                                </Box>
                                {(renderVariantTooltipText(
                                    tab.visualizationOptions.id,
                                    false,
                                    true
                                ) && (
                                    <Box ml={1}>
                                        <IconTooltip
                                            title={renderVariantTooltipText(
                                                tab.visualizationOptions.id
                                            )}>
                                            <Box
                                                className={classesIndicator.tabInfoVariant}
                                                style={{
                                                    backgroundColor:
                                                        index !== value
                                                            ? alpha(theme.palette.text.primary, 0.2)
                                                            : null
                                                }}
                                            />
                                        </IconTooltip>
                                    </Box>
                                )) ||
                                    ''}
                            </Box>
                        )}
                        {...a11yProps(index)}
                        classes={{ root: classesTab.rootVertical }}
                        className={tabConfiguration.tabCompactClasses(index)}
                        icon={
                            compactTabs ? (
                                <IconTooltip
                                    title={
                                        renderVariantTooltipText(
                                            tab.visualizationOptions.id,
                                            true,
                                            false
                                        ) || ''
                                    }>
                                    {tab.icon || tabConfiguration.compactTabIcon}
                                </IconTooltip>
                            ) : (
                                tab.icon || tabConfiguration.compactTabIcon
                            )
                        }
                        iconPosition={tab.iconPosition}
                        style={{
                            ...tab?.css,
                            ...tabConfiguration.tabCompactStyle,
                            borderLeft: tabStyling.hasBorder ? borderDarker : 'none',
                            borderRight: tabStyling.hasBorder ? borderDarker : 'none',
                            borderTop: tabStyling.hasBorder ? borderDarker : 'none',
                            borderBottom: tabStyling.hasBorder ? borderDarker : 'none'
                        }}
                    />
                ))}
                {!isTablet && hasToggle && isVertical && (
                    <ToggleButton style={{ ...tabConfiguration.tabCompactStyle, marginLeft: -2 }} />
                )}
            </QlikVisualizationTabsVertical>
        )
    }

    const tabsContentRender = visualizations.map((visualization, index) => {
        const visualizationOptions = {
            ...visualization.visualizationOptions,
            isToolbarOnPanel: !isVertical
        }

        return (
            <QlikVisualizationTabContent
                value={value || 0}
                index={index}
                key={`scrollable-tab-panel-${index}`}
                height={tabOptions?.height}
                enableSocialBar={enableSocialBar}
                isVertical={isVertical}
                classNames={{
                    tabContent: tabOptions?.classNames?.tabContent,
                    tabContentSocial: tabOptions?.classNames?.tabContentSocial
                }}>
                <Box display="flex" style={{ position: 'relative' }}>
                    <VerticalTabs />
                    {tabConfiguration.tabCompactCurrentTitle && (
                        <Typography
                            variant="subtitle2"
                            style={{ position: 'absolute', left: 60, top: 16 }}>
                            {tabConfiguration.tabCompactCurrentTitle}
                        </Typography>
                    )}

                    <QlikActionsProvider>
                        <QlikTitleProvider>
                            <QlikVisualizationCore
                                key={visualizations[value].visualizationOptions.id}
                                {...visualizationOptions}
                            />
                        </QlikTitleProvider>
                    </QlikActionsProvider>
                </Box>
            </QlikVisualizationTabContent>
        )
    })

    const socialBar = enableSocialBar && (
        <Box className={`${classes.socialBar} ${tabOptions?.classNames?.tabSocialBar}`}>
            <Divider variant="fullWidth" />
            <QlikSocialBar />
        </Box>
    )

    return {
        value,
        classes,
        isTablet,
        socialBar,
        isVertical,
        classesTab,
        handleChange,
        visualizationId,
        renderTabLabels,
        tabConfiguration,
        classesIndicator,
        toolbarComponent,
        showVisualization,
        tabsContentRender,
        cssQlikPanelPaper
    }
}

export default useQlikVisualizationTabsConfiguration

const useStyles = makeStyles()((theme: any) => ({
    grow: {
        flexGrow: 1
    },
    socialBar: {
        background: theme.palette.common.white,
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
        borderBottom: `1px solid ${theme.palette.divider}`,
        borderRight: `1px solid ${theme.palette.divider}`,
        borderLeft: `1px solid ${theme.palette.divider}`
    },
    svgIcon: {
        fontSize: '1.8rem',
        marginTop: '5px',
        color: '#273540'
    },
    tabActiveTypography: {
        fontSize: '0.875rem',
        fontWeight: 600
    },
    tabInActiveTypography: {
        fontSize: '0.875rem'
    },
    tabActive: {
        fontSize: 15,
        fontWeight: 600,
        borderBottom: '1px solid white',
        textTransform: 'none',
        '@media (max-width: 960px)': {
            fontSize: 14
        },
        '@media (max-width: 700px)': {
            fontSize: 13,
            padding: '6px'
        },
        '@media (max-width: 480px)': {
            fontSize: 12
        },
        '@media (max-width: 400px)': {
            fontSize: 11,
            fontWeight: 400
        },
        '@media (max-width: 310px)': {
            fontSize: 9
        }
    },
    tabDropdownActive: {
        fontSize: 14,
        fontWeight: 600,
        color: theme.palette.text.primary,
        textTransform: 'none',
        minWidth: '100px',
        width: '100px',
        maxWidth: '250px',
        '@media (max-width: 960px)': {
            fontSize: 14
        },
        '@media (max-width: 760px)': {
            maxWidth: '250px'
        },
        '@media (max-width: 600px)': {
            padding: '6px',
            fontSize: 13
        },
        '@media (max-width: 480px)': {
            fontSize: 12
        },
        '@media (max-width: 400px)': {
            fontSize: 11,
            fontWeight: 400,
            width: 70
        },
        '@media (max-width: 310px)': {
            fontSize: 9
        },
        height: '50px'
    },
    tabInActive: {
        borderTop: '1px solid #e7e7e7',
        borderBottom: '1px solid #e7e7e7',
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: 0,
        textAlign: 'center',
        textTransform: 'none',
        '@media (max-width: 960px)': {
            fontSize: 12,
            fontWeight: 400
        },
        '@media (max-width: 700px)': {
            padding: '11px',
            fontSize: 11
        },
        '@media (max-width: 480px)': {
            fontSize: 10
        },
        '@media (max-width: 310px)': {
            fontSize: 9
        },
        height: '50px'
    },
    tabIconWrapper: {
        paddingRight: `4px`
    },
    popoverActive: {
        minWidth: '100px',
        width: '120px',
        maxWidth: '250px',
        fontSize: 13,
        fontWeight: 600,
        textTransform: 'none'
    },
    popoverInActive: {
        minWidth: '100px',
        width: '120px',
        maxWidth: '250px',
        fontSize: 12,
        fontWeight: 500,
        textTransform: 'none'
    },
    scrollButton: {
        height: '50px'
    },
    toolbarRoot: {
        paddingLeft: '0px',
        paddingRight: '0px'
    },
    toolbar: {
        borderBottom: '1px solid #e7e7e7',
        borderRight: '1px solid #e7e7e7',
        borderLeft: '1px solid #e7e7e7',
        borderTop: '1px solid #e7e7e7',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        backgroundColor: '#FFF',
        paddingRight: 0,
        height: '50px'
    },
    toolbarMenu: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '44px',
        height: '100%',
        borderLeft: '1px solid #ececec',
        '@media (max-width: 1100px)': {
            '& svg': {
                height: '20px !important'
            }
        },
        '@media (max-width: 660px)': {
            width: '50px'
        },
        '@media (max-width: 580px)': {
            width: '35px'
        },
        '@media (max-width: 350px)': {
            width: '30px'
        },
        '@media (max-width: 310px)': {
            width: '25px'
        }
    },
    paper: {
        borderRadius: '8px'
    },
    highlightedPaper: {
        border: `2px solid ${alpha(R.colors.socialGreen, 0.5)}`,
        borderRadius: '8px'
    },
    popover: {
        display: 'flex',
        flexDirection: 'column',
        left: '88px !important',
        alignItems: 'start',
        minWidth: '200px'
    },
    verticalActive: {
        fontSize: '14.5px',
        '@media (max-width: 1100px)': {
            fontSize: '14px'
        },
        '@media (max-width: 700px)': {
            fontSize: '13px'
        }
    },
    verticalInactive: {
        fontSize: '13px',
        '@media (max-width: 1100px)': {
            fontSize: '12px'
        },
        '@media (max-width: 700px)': {
            fontSize: '11px'
        }
    }
}))
