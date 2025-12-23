import React, { FC } from 'react'

import { Box, CircularProgress, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

export interface IQlikReportingLoaderProps {
    color?: any
    customLoader?: React.ReactNode
}

const QlikReportingLoader: FC<IQlikReportingLoaderProps> = ({
    color = 'secondary',
    customLoader
}) => {
    const { classes } = useStyles()

    return (
        <Box className={classes.content}>
            {customLoader || <CircularProgress color={color} size={80} />}
            <Box mt={2} />
        </Box>
    )
}

export default QlikReportingLoader

const useStyles = makeStyles()((theme: Theme) => ({
    content: {
        display: 'table-cell',
        textAlign: 'center',
        verticalAlign: 'middle',
        width: '100%'
    }
}))
