import { Theme } from '@mui/material'
import { Button } from '@mui/material'

import { withStyles } from 'tss-react/mui'

const StyledActionButton = withStyles(Button, (theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.primary.contrastText,
        color: `${theme.palette.primary.main} !important`,
        border: `1px solid ${theme.palette.primary.main}`,
        '&:hover': {
            backgroundColor: theme.palette.primary.contrastText,
            color: `${theme.palette.primary.main} !important`,
            border: `1px solid ${theme.palette.primary.main}`
        }
    },
    disabled: {
        backgroundColor: theme.palette.primary.contrastText,
        color: `${theme.palette.text.disabled} !important`,
        border: `1px solid ${theme.palette.text.disabled}`
    }
}))

export default StyledActionButton
