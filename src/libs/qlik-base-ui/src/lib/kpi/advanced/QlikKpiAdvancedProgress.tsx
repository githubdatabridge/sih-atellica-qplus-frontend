import React from 'react'

import { Box, CircularProgress } from '@mui/material'

const QlikKpiAdvancedProgress = () => {
    return (
        <Box flexGrow={1} width={1}>
            <Box alignItems="center">
                <CircularProgress color="secondary" size={10} style={{ marginTop: '15px' }} />
            </Box>
        </Box>
    )
}

export default QlikKpiAdvancedProgress
