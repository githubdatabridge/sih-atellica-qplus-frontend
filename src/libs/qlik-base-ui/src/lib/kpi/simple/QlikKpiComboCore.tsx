import React, { FC, memo, useState, useEffect } from 'react'

import ReactHtmlParser from 'react-html-parser'

import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box, Typography, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { KpiChartLoader, AppInfoIcon } from '@libs/common-ui'
import { useQlikExpression } from '@libs/qlik-capability-hooks'
import { QAction } from '@libs/qlik-models'
import { useQlikApp } from '@libs/qlik-providers'
import { useQlikActionsContext } from '@libs/qlik-providers'

import QlikHyperlinkButton from '../../button/QlikHyperlinkButton'
import QlikToolbar from '../../visualizations/toolbar/QlikToolbar'
import { IQlikToolbarInfoProps } from '../../visualizations/toolbar/QlikToolbarInfo'

type TQlikKpiComboCoreClassNames = {
    toolbar?: string
    footNote?: string
    footNoteText?: string
}
interface IQlikKpiComboCoreLinkOptions {
    pathName: string
    search?: string
    qlikActions?: QAction[]
    color?: 'primary' | 'info' | 'secondary' | 'default'
    className?: string
    icon?: React.ReactNode
}

export interface IQlikKpiComboCoreProps {
    id: string
    qlikAppId?: string
    infoOptions?: IQlikToolbarInfoProps
    kpiExpression: string
    titleExpression?: string
    subTitlePeriodExpression?: string
    subTitleExpression?: string
    footerExpression?: string
    trendIconExpression?: string
    trendValueExpression?: string
    trendPercentageExpression?: string
    title?: string
    subtitle?: string
    footNote?: string
    height?: string
    icon?: React.ReactNode
    children?: React.ReactNode
    visualizationComponent?: React.ReactNode
    cssTitleTypography?: any
    cssSubtitleTypography?: any
    cssKpiTypography?: any
    cssTrendTypography?: any
    cssTrendTypographyMain?: any
    linkOptions?: IQlikKpiComboCoreLinkOptions
    showAppWaterMark?: boolean
    classNames?: TQlikKpiComboCoreClassNames
}

export const QlikKpiComboCore: FC<IQlikKpiComboCoreProps> = ({
    id,
    title = '',
    subtitle = '',
    footNote = '',
    qlikAppId,
    infoOptions,
    titleExpression,
    subTitlePeriodExpression,
    subTitleExpression,
    footerExpression,
    kpiExpression,
    trendIconExpression,
    trendValueExpression,
    trendPercentageExpression,
    visualizationComponent,
    linkOptions,
    showAppWaterMark = false,
    icon,
    height = '180px',
    cssTitleTypography,
    cssSubtitleTypography,
    cssKpiTypography,
    cssTrendTypography,
    cssTrendTypographyMain,
    classNames
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { qMeta, qTitle, qDescription, qAppId } = useQlikApp(qlikAppId)
    const { setActionsNode } = useQlikActionsContext()

    const {
        qKpis: [
            qKpiExpression,
            qTrendIconExpression,
            qTrendValueExpression,
            qTrendPercentageExpression,
            qTitleExpression,
            qSubTitlePeriodExpression,
            qSubTitleExpression,
            qFooterExpression
        ]
    } = useQlikExpression({
        qlikAppId: qAppId,
        expressions: [
            kpiExpression,
            trendIconExpression || "=''",
            trendValueExpression || "=''",
            trendPercentageExpression || "=''",
            titleExpression || "=''",
            subTitlePeriodExpression || "=''",
            subTitleExpression || "=''",
            footerExpression || "=''"
        ]
    })

    const { classes } = useStyles()

    const toolbar = (
        <QlikToolbar
            infoOptions={
                infoOptions && {
                    ...infoOptions
                }
            }
            className={classNames?.toolbar}
        />
    )

    const renderTextColor = (icon: string) => {
        switch (icon) {
            case '1':
                return '#009733'
            case '2':
                return '#EB3434'
            default:
                return '#627478'
        }
    }

    useEffect(() => {
        if (kpiExpression) {
            setTimeout(() => {
                setActionsNode(toolbar)
                setIsLoading(false)
            }, 2000)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kpiExpression])

    const renderIcon = (icon: string) => {
        switch (icon) {
            case '1':
                return (
                    <TrendingUpIcon style={{ paddingTop: '5px', fill: '#009733', fontSize: 24 }} />
                )
            case '2':
                return (
                    <TrendingDownIcon
                        style={{ paddingTop: '5px', fill: '#EB3434', fontSize: 24 }}
                    />
                )
            default:
                return (
                    <TrendingFlatIcon
                        style={{ paddingTop: '5px', fill: '#627478', fontSize: 24 }}
                    />
                )
        }
    }

    if (isLoading) return <KpiChartLoader />

    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                style={{
                    marginTop: '-20px',
                    height
                }}>
                {(title || qTitleExpression) && (
                    <Typography className={classes.title} style={cssTitleTypography}>
                        {title || qTitleExpression}
                    </Typography>
                )}

                {(subtitle || qSubTitleExpression) && (
                    <Box display="flex" alignItems="center">
                        <Typography className={classes.subTitle} style={cssSubtitleTypography}>
                            {subtitle || qSubTitleExpression}
                        </Typography>

                        <Typography style={cssSubtitleTypography} className={classes.subTitle}>
                            &nbsp;{qSubTitlePeriodExpression}
                        </Typography>
                    </Box>
                )}

                <Box display="flex" alignItems="center" mt={2}>
                    {icon ? (
                        <Box style={{ marginRight: '10px', marginTop: '2px' }}> {icon} </Box>
                    ) : null}
                    <Typography
                        noWrap
                        display="inline"
                        className={classes.kpi}
                        style={cssKpiTypography}>
                        {ReactHtmlParser(qKpiExpression)}
                    </Typography>
                </Box>
                {visualizationComponent}

                <Box display="flex" alignItems="center">
                    {qTrendIconExpression && renderIcon(qTrendIconExpression)}
                    <Typography
                        color="textSecondary"
                        noWrap
                        display="inline"
                        className={classes.trendMain}
                        style={{
                            color: renderTextColor(qTrendIconExpression),
                            ...cssTrendTypographyMain
                        }}>
                        {ReactHtmlParser(qTrendValueExpression) || ''}
                    </Typography>
                    {qTrendPercentageExpression ? (
                        <>
                            <Typography
                                color="textSecondary"
                                noWrap
                                display="inline"
                                className={classes.trend}
                                style={{
                                    color: renderTextColor(qTrendIconExpression),
                                    ...cssTrendTypography
                                }}>
                                {'('}
                            </Typography>

                            <Typography
                                color="textSecondary"
                                noWrap
                                display="inline"
                                className={classes.trend}
                                style={{
                                    color: renderTextColor(qTrendIconExpression),
                                    ...cssTrendTypography
                                }}>
                                {ReactHtmlParser(qTrendPercentageExpression) || ''}
                            </Typography>
                            <Typography
                                color="textSecondary"
                                noWrap
                                display="inline"
                                className={classes.trend}
                                style={{
                                    color: renderTextColor(qTrendIconExpression),
                                    ...cssTrendTypography
                                }}>
                                {')'}
                            </Typography>
                        </>
                    ) : (
                        ''
                    )}
                </Box>
            </Box>
            {(showAppWaterMark || linkOptions || qFooterExpression || footNote) && (
                <Box
                    display="flex"
                    width="100%"
                    justifyContent="center"
                    alignItems="center"
                    pl={1}
                    pr={1}
                    className={`${classes.footNote} ${classNames?.footNote}`}>
                    <Box flexGrow={1}>
                        <Typography
                            className={`${classes.footNoteText} ${classNames?.footNoteText}`}>
                            {footNote || qFooterExpression}
                        </Typography>
                    </Box>
                    {linkOptions && (
                        <Box pr={showAppWaterMark ? 1 : 0}>
                            <QlikHyperlinkButton {...linkOptions} />
                        </Box>
                    )}
                    {showAppWaterMark && (
                        <Box pr={1}>
                            <AppInfoIcon
                                initials={qMeta?.initials}
                                title={qTitle}
                                text={qDescription}
                                backgroundColor={qMeta?.backgroundColor}
                                color={qMeta?.color}
                            />
                        </Box>
                    )}
                </Box>
            )}
        </>
    )
}

export default memo(QlikKpiComboCore)

const useStyles = makeStyles()((theme: Theme) => {
    return {
        title: {
            fontSize: 20,
            fontWeight: 400,
            opacity: 1,
            paddingBottom: '2px',
            '@media (max-width: 1100px)': {
                fontSize: 16
            }
        },
        subTitle: {
            fontSize: 12,
            fontWeight: 300,
            color: '#888d8f'
        },
        kpi: {
            paddingBottom: '5px',
            fontWeight: 400,
            fontSize: 30,
            color: theme.palette.text.primary,
            '@media (max-width: 1100px)': {
                fontSize: 24,
                '& > span': {
                    fontSize: '16px !important'
                }
            }
        },
        trend: {
            fontSize: 12,
            verticalAlign: 'bottom'
        },
        trendMain: {
            padding: '5px',
            fontSize: 18,
            verticalAlign: 'bottom'
        },
        footNote: {
            backgroundColor: theme.palette.background.default,
            height: '35px'
        },
        footNoteText: {
            fontSize: '0.825rem',
            fontStyle: 'italic',
            color: theme.palette.text.primary
        }
    }
})
