import { Theme, Tooltip } from '@mui/material'

import { withStyles } from 'tss-react/mui'

const LightTooltip = withStyles(Tooltip, (theme: Theme) => ({
    tooltip: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.getContrastText(theme.palette.text.primary),
        boxShadow: theme.shadows[7],
        maxWidth: 'none',
        borderRadius: '3px !important'
    },
    popper: {
        backgroundColor: 'transparent'
    },
    arrow: {
        color: theme.palette.background.paper,
        '&::before': {
            boxShadow: theme.shadows[7]
        }
    }
}))
export default LightTooltip
