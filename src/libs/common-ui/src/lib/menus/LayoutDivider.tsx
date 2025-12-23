import { Theme } from '@mui/material'
import MUIDivider from '@mui/material/Divider'

import { withStyles } from 'tss-react/mui'

const LayoutDivider = withStyles(MUIDivider, (theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.primary.light
    }
}))

export default LayoutDivider
