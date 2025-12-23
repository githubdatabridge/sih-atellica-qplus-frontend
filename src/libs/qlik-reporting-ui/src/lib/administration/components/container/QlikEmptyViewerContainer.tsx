import React from 'react'

import { Box, Typography, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'

import translation from '../../constants/translations'

export const QlikEmptyViewerContainer = React.memo(() => {
    const { t } = useI18n()

    const { classes } = useStyles()
    return (
        <Box display="flex" alignItems="center" className={classes.emptyContainer}>
            <Box flexGrow="1" textAlign="center">
                <Typography className={classes.emptyText}>
                    {t(translation.datasetReadyChartSection)}
                </Typography>
            </Box>
        </Box>
    )
})

const useStyles = makeStyles()((theme: Theme) => ({
    emptyContainer: {
        minHeight: '350px',
        width: '100%',
        border: `1px solid ${theme.palette.divider}`,
        overflowY: 'scroll',
        background: theme.palette.background.default
    },
    emptyText: {
        fontSize: '0.775rem',
        fontStyle: 'oblique',
        fontColor: theme.palette.text.disabled
    }
}))
