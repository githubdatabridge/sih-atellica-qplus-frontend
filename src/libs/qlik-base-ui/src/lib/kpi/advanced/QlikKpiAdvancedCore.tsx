import React, { FC, useState, useEffect } from 'react'

import ReactHtmlParser from 'react-html-parser'

import { Box, Card, CardContent } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import { makeStyles } from 'tss-react/mui'

import { KpiChartLoader, AppInfoIcon } from '@libs/common-ui'
import { useQlikExpression } from '@libs/qlik-capability-hooks'
import { QAction } from '@libs/qlik-models'
import { useQlikApp } from '@libs/qlik-providers'

import QlikHyperlinkButton from '../../button/QlikHyperlinkButton'
import SvgArrowDown from './icons/SvgArrowDown'
import SvgArrowUp from './icons/SvgArrowUp'
import QlikKpiAdvancedNavigator from './QlikKpiAdvancedNavigator'

type TQField = {
    fieldName?: string
    calcFieldName?: string
    stateName?: string
    isFirstElementPreSelected?: boolean
}

type TQlikKpiAdvancedClasses = {
    card?: string
    cardContent?: string
    footNote?: string
    footNoteText?: string
}

interface IQlikKpiAdvancedCoreLinkOptions {
    pathName: string
    search?: string
    qlikActions?: QAction[]
    color?: 'primary' | 'info' | 'secondary' | 'default'
    className?: string
    icon?: React.ReactNode
}

export interface IQlikKpiAdvancedCoreProps {
    id: string
    qlikAppId?: string
    kpiExpression: string
    titleExpression: string
    subTitleExpression: string
    footerExpression?: string
    trendExpression?: string
    isDivider?: boolean
    fieldNavigator?: TQField
    themeMode?: string
    colorTrendUp?: string
    colorTrendDown?: string
    showAppWaterMark?: boolean
    linkOptions?: IQlikKpiAdvancedCoreLinkOptions
    classNames: Partial<TQlikKpiAdvancedClasses>
}

const QlikKpiAdvancedComboCore: FC<IQlikKpiAdvancedCoreProps> = ({
    qlikAppId,
    titleExpression,
    kpiExpression,
    subTitleExpression,
    footerExpression,
    trendExpression,
    fieldNavigator,
    isDivider = true,
    themeMode = 'light',
    colorTrendUp,
    colorTrendDown,
    linkOptions,
    showAppWaterMark = false,
    classNames
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { qMeta, qTitle, qDescription, qAppId } = useQlikApp(qlikAppId)

    const {
        qKpis: [
            qKpiExpression,
            qTitleExpression,
            qSubTitleExpression,
            qTrendExpression,
            qFooterExpression
        ]
    } = useQlikExpression({
        qlikAppId: qAppId,
        expressions: [
            kpiExpression || "=''",
            titleExpression || "=''",
            subTitleExpression || "=''",
            trendExpression || "=''",
            footerExpression || "=''"
        ]
    })

    const useStyles = makeStyles()((theme: any) => ({
        paper: {
            backgroundColor: themeMode === 'light' ? '#FFF' : theme.palette.primary.dark
        },
        card: {
            boxShadow: 'none',
            backgroundColor: themeMode === 'light' ? '#FFF' : theme.palette.primary.dark
        },
        cardContent: {
            textAlign: 'center',
            backgroundColor: themeMode === 'light' ? '#FFF' : theme.palette.primary.dark
        },
        labelTop: {
            color: themeMode === 'light' ? theme.palette.primary.dark : '#FFF',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: 0,
            lineHeight: '18px',
            textAlign: 'center'
        },
        kpiMain: {
            color: themeMode === 'light' ? theme.palette.primary.dark : '#FFF',
            fontSize: '20px',
            fontWeight: 600,
            letterSpacing: 0,
            lineHeight: '32px',
            textAlign: 'center'
        },
        labelBottom: {
            opacity: 0.32,
            color: themeMode === 'light' ? theme.palette.primary.dark : '#FFF',
            fontSize: '0.875rem',
            fontWeight: 500,
            letterSpacing: 0,
            lineHeight: '16px',
            textAlign: 'center',
            paddingTop: '8px'
        },
        icon: {
            color: '#232355'
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
    }))

    const { classes } = useStyles()
    const theme = useTheme()

    useEffect(() => {
        if (kpiExpression) {
            setTimeout(() => {
                setIsLoading(false)
            }, 2000)
        }
    }, [kpiExpression])

    const renderIcon = (icon: string) => {
        switch (icon) {
            case '1':
                return <SvgArrowUp style={{ fill: colorTrendUp || theme.palette.secondary.main }} />
            case '-1':
                return <SvgArrowDown style={{ fill: colorTrendDown || '#C24056' }} />
            default:
                return <></>
        }
    }

    if (isLoading) return <KpiChartLoader />

    return (
        <Card className={`${classes.card} ${classNames?.card}`}>
            <CardContent className={`${classes.cardContent} ${classNames?.cardContent}`}>
                <Box
                    display="flex"
                    width={1}
                    style={{
                        paddingTop: '0px',
                        paddingBottom: '0px',
                        paddingLeft: '8px',
                        paddingRight: '8px'
                    }}>
                    <Box flexGrow={1} width={1}>
                        {qTitleExpression && (
                            <Box alignItems="center">
                                <Typography className={classes.labelTop}>
                                    {fieldNavigator ? (
                                        <QlikKpiAdvancedNavigator
                                            qlikAppId={qlikAppId}
                                            fieldName={fieldNavigator.fieldName}
                                            isFirstElementPreSelected={
                                                fieldNavigator.isFirstElementPreSelected
                                            }
                                            themeMode={themeMode}
                                            calcFieldName={fieldNavigator.calcFieldName}
                                            stateName={fieldNavigator.stateName}>
                                            {qTitleExpression
                                                ? qTitleExpression?.length <= 20
                                                    ? qTitleExpression
                                                    : `${qTitleExpression?.slice(0, 15)}...`
                                                : ''}{' '}
                                        </QlikKpiAdvancedNavigator>
                                    ) : (
                                        <Typography className={classes.labelTop}>
                                            {qTitleExpression}
                                        </Typography>
                                    )}
                                </Typography>
                            </Box>
                        )}
                        <Box
                            alignItems="center"
                            width={1}
                            style={
                                fieldNavigator ? { paddingTop: '14px' } : { paddingTop: '16px' }
                            }>
                            <Box
                                display={`${qTrendExpression ? 'inline-flex' : 'inherit'}`}
                                p={0}
                                className={classes.paper}>
                                <Box>
                                    <Typography className={classes.kpiMain}>
                                        {ReactHtmlParser(qKpiExpression)}
                                    </Typography>
                                </Box>
                                {qTrendExpression && renderIcon(qTrendExpression) ? (
                                    <Box style={{ marginLeft: '4px', marginTop: '4px' }}>
                                        {renderIcon(qTrendExpression)}
                                    </Box>
                                ) : null}
                            </Box>
                        </Box>
                        <Box alignItems="center" width={1}>
                            <Typography className={classes.labelBottom}>
                                {ReactHtmlParser(qSubTitleExpression || '')}
                            </Typography>
                        </Box>
                    </Box>
                    {isDivider ? (
                        <Box
                            style={{
                                height: '80px',
                                width: '60px',
                                boxShadow: `${
                                    isDivider
                                        ? 'inset -1px 0 0 0 #EBEBEB'
                                        : 'inset -1px 0 0 0 transparent'
                                }`,
                                marginTop: '15px'
                            }}></Box>
                    ) : null}
                </Box>
                {(showAppWaterMark || linkOptions || qFooterExpression) && (
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
                                {qFooterExpression}
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
            </CardContent>
        </Card>
    )
}

export default QlikKpiAdvancedComboCore
