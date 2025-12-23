import React from 'react'

import Box from '@mui/material/Box'

export interface ITabPanelProps {
    children?: React.ReactNode
    index: any
    value: any
    css?: any
}

const TabsPanel: React.FC<ITabPanelProps> = ({ children, value, index, css, ...other }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            key={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}>
            {value === index && (
                <Box p={2} style={css}>
                    {children}
                </Box>
            )}
        </div>
    )
}

export default React.memo(TabsPanel)
