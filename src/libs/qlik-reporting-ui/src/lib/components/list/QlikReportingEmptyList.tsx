import React, { FC, useEffect, useState } from 'react'

import WidgetsIcon from '@mui/icons-material/Widgets'
import { Box, IconButton, Typography, lighten } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { useQlikReportingContext } from '../../contexts/QlikReportingContext'

export interface IQlikReportingEmptyListProps {
    message: string
    height: string
}

const QlikReportingEmptyList: FC<IQlikReportingEmptyListProps> = ({ message, height }) => {
    const { reportVizType, reportDataset } = useQlikReportingContext()
    const [isDisabled, setIsDisabled] = useState<boolean>(true)

    const theme = useTheme()

    useEffect(() => {
        setIsDisabled(!(reportVizType && reportDataset))
        return () => {}
    }, [reportVizType, reportDataset])
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height={height}>
            <IconButton
                color="primary"
                aria-label="settings"
                component="span"
                style={{ color: lighten(theme.palette.text.primary, 0.5) }}
                disabled={isDisabled}>
                <WidgetsIcon fontSize="large" />
            </IconButton>
            <Typography
                sx={{
                    fontWeight: 500,
                    fontSize: '0.825rem',
                    opacity: 0.7,
                    paddingTop: '10px',
                    color: isDisabled
                        ? lighten(theme.palette.text.primary, 0.5)
                        : theme.palette.text.primary
                }}>
                {message}
            </Typography>
        </Box>
    )
}

export default QlikReportingEmptyList
