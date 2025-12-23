import React, { FC, useState, useEffect } from 'react'

import ReactHtmlParser from 'react-html-parser'

import { Typography, Box, Card, CardContent, CardActions } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useQlikExpression } from '@libs/qlik-capability-hooks'
import { useQlikApp } from '@libs/qlik-providers'

import { useQlikCardContext } from './QlikCardContext'
import QlikCardInfoFooter from './QlikCardInfoFooter'
import QlikCardInfoNavigator from './QlikCardInfoNavigator'
import QlikCardInfoSelectTooltip from './QlikCardInfoSelectTooltip'
import QlikCardRating from './QlikCardRating'

type TQField = {
    fieldName?: string
    calcFieldName?: string
    stateName?: string
    isFirstElementPreSelected?: boolean
}

export interface IQlikCardInfoCoreProps {
    id: string
    qlikAppId?: string
    cardInfoExpression: string
    titleExpression?: string
    subTitleExpression?: string
    fieldHeader?: TQField
    fieldMain: TQField
    showFooter?: boolean
}

const QlikEtopsCardInfoCore: FC<IQlikCardInfoCoreProps> = ({
    qlikAppId,
    titleExpression,
    cardInfoExpression,
    subTitleExpression,
    fieldHeader,
    fieldMain,
    showFooter = true
}) => {
    const { isCardLoading, cardFooter } = useQlikCardContext()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [footer, setFooter] = useState<string>('')
    const { qAppId } = useQlikApp(qlikAppId)
    const {
        qKpis: [qInfoExpression, qTitleExpression, qSubTitleExpression]
    } = useQlikExpression({
        qlikAppId: qAppId,
        expressions: [cardInfoExpression, titleExpression, subTitleExpression || "=''"]
    })

    useEffect(() => {
        setIsLoading(isCardLoading)
    }, [isCardLoading])

    useEffect(() => {
        setFooter(cardFooter)
    }, [cardFooter])

    const { classes } = useStyles()

    return (
        <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
                <Box display="flex" width={1} className={classes.box}>
                    <Box flexGrow={1} width={1}>
                        {fieldHeader ? (
                            <QlikCardInfoNavigator
                                qlikAppId={qlikAppId}
                                fieldName={fieldHeader.fieldName}
                                isFirstElementPreSelected={fieldHeader.isFirstElementPreSelected}
                                calcFieldName={fieldHeader.calcFieldName}
                                stateName={fieldHeader.stateName}>
                                {qTitleExpression
                                    ? qTitleExpression?.length <= 20
                                        ? qTitleExpression
                                        : `${qTitleExpression?.slice(0, 20)}...`
                                    : ''}
                            </QlikCardInfoNavigator>
                        ) : null}
                        <div
                            style={{
                                display: !isLoading ? 'block' : 'none',
                                marginTop: !fieldHeader ? '-13px' : null
                            }}>
                            <QlikCardInfoSelectTooltip
                                qlikAppId={qlikAppId}
                                fieldName={fieldMain.fieldName}
                                calcFieldName={fieldMain.calcFieldName}
                                stateName={fieldMain.stateName}
                                isFirstElementPreSelected={fieldMain.isFirstElementPreSelected}
                                className={classes.label}
                                selectComponent={
                                    <Typography sx={{ fontSize: '0.825rem' }}>
                                        {ReactHtmlParser(
                                            qInfoExpression
                                                ? qInfoExpression?.length <= 30
                                                    ? `${qInfoExpression} ${
                                                          !subTitleExpression ? '<br>' : ''
                                                      }`
                                                    : `${qInfoExpression?.slice(0, 30)}...<br>`
                                                : ''
                                        )}
                                    </Typography>
                                }
                            />
                            {qSubTitleExpression ? (
                                <QlikCardRating rating={parseInt(qSubTitleExpression)} />
                            ) : null}
                        </div>
                    </Box>
                </Box>
            </CardContent>
            {showFooter ? (
                <CardActions
                    className={classes.actions}
                    style={{ display: !isLoading ? 'block' : 'none' }}>
                    <QlikCardInfoFooter text={footer} />
                </CardActions>
            ) : null}
        </Card>
    )
}

export default QlikEtopsCardInfoCore

const useStyles = makeStyles()((theme: any) => ({
    card: {
        boxShadow: 'none',
        backgroundColor: theme.palette.primary.dark
    },
    actions: {
        textAlign: 'left',
        padding: '0px',
        marginTop: '3px'
    },
    box: {
        paddingTop: '0px',
        paddingBottom: '0px',
        paddingLeft: '8px',
        paddingRight: '8px'
    },
    cardContent: {
        textAlign: 'center',
        backgroundColor: theme.palette.primary.dark
    },
    label: {
        color: '#FFF',
        fontSize: '20px',
        fontWeight: 600,
        letterSpacing: 0,
        lineHeight: '32px',
        textAlign: 'center'
    }
}))
