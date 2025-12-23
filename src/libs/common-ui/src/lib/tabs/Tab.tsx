import React from 'react'

import { Theme } from '@mui/material'
import MUITab from '@mui/material/Tab'

import { withStyles } from 'tss-react/mui'

export interface IStyledTabProps {
    label: string
}

const Tab = withStyles(
    (props: IStyledTabProps) => <MUITab disableRipple {...props} />,
    (theme: Theme) => ({
        root: {
            textTransform: 'none',
            minWidth: 72,
            fontSize: '1.2rem',
            '&$selected': {
                fontWeight: theme.typography.fontWeightMedium
            }
        },
        selected: {}
    })
)

export default React.memo(Tab)
