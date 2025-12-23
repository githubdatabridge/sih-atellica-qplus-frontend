import React from 'react'

import { Box, CircularProgress } from '@mui/material'

const QlikCardInfoProgress = () => {
    return (
        <Box flexGrow={1} width={1}>
            <Box alignItems="center">
                <CircularProgress color="secondary" size={50} style={{ marginTop: '15px' }} />
            </Box>
        </Box>
    )
}

export default React.memo(QlikCardInfoProgress)
