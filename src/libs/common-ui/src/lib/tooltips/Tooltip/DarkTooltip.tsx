import { Theme, Tooltip } from '@mui/material'

import { withStyles } from 'tss-react/mui'

const DarkTooltip = withStyles(Tooltip, (theme: Theme) => ({
    tooltip: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.getContrastText(theme.palette.text.primary),
        boxShadow: theme.shadows[7],
        maxWidth: 'none',
        zIndex: 12000,
        borderRadius: '3px !important'
    },
    arrow: {
        color: theme.palette.background.paper,
        '&::before': {
            boxShadow: theme.shadows[7]
        }
    }
}))

export default DarkTooltip
