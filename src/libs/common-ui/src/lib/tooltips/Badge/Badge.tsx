import { Theme } from '@mui/material'
import MUIBadge from '@mui/material/Badge'

import { withStyles } from 'tss-react/mui'

const Badge = withStyles(MUIBadge, (_theme: Theme) => ({
    badge: {
        background: _theme.palette.secondary.main,
        // zIndex: _theme.zIndex.modal + 2
        zIndex: 1019
    }
}))

export default Badge
