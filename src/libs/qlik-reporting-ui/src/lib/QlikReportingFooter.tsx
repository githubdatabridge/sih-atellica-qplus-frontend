import React, { FC } from 'react'

import { Box, Typography, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { QlikReportingPaintBrushIconButton } from './components/iconButton'

type TQlikReportingFooterClasses = {
    iconButton: string
}

export interface IQlikReportingFooterProps {
    author: string
    classNames: Partial<TQlikReportingFooterClasses>
}

const QlikReportingFooter: FC<IQlikReportingFooterProps> = ({ author, classNames }) => {
    const { classes } = useStyles()

    return (
        <Box width="100%" textAlign="right" display="flex" pb={1} pt={3}>
            <Box flexGrow={1}></Box>
            <Box pr={1}>
                <QlikReportingPaintBrushIconButton
                    classNames={{
                        iconButton: classNames?.iconButton || ''
                    }}
                />
            </Box>
            <Box pr={2}>
                <Typography className={classes.author}>by {author || 'N/A'}</Typography>
            </Box>
        </Box>
    )
}

export default QlikReportingFooter

const useStyles = makeStyles()((theme: Theme) => ({
    author: {
        padding: 2,
        borderRadius: '16px',
        color: theme.palette.text.primary,
        fontWeight: 500,
        fontSize: '1rem',
        fontFamily: 'Brush Script MT !important'
    }
}))
