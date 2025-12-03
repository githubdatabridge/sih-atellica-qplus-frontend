import { Theme } from '@mui/material/styles'
import { withStyles } from 'tss-react/mui'
import ButtonBase from '@mui/material/ButtonBase'

const HeaderButton = withStyles(ButtonBase, (theme: Theme) => ({
    root: {
        height: 50,
        width: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: theme.palette.common.white
    }
}))

export default HeaderButton
