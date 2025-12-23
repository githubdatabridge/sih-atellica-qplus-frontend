import React, { FC } from 'react'

import { Box, Typography } from '@mui/material'
import { useTheme, Theme } from '@mui/material/styles'

interface Props {
    title: string
}
const PinWallDivider: FC<Props> = ({ title }) => {
    const theme = useTheme()
    return (
        <Box
            style={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                paddingBottom: '3px'
            }}>
            <Typography
                style={{
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                    fontSize: '1rem'
                }}>
                {title}
            </Typography>
        </Box>
    )
}

export default PinWallDivider
