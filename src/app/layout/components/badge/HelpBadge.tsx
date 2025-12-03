import React from 'react'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import ButtonBase from '@mui/material/ButtonBase'
import { Badge } from '@mui/material'
import { QplusBaseIconTooltip } from '@databridge/qplus'
import { Theme } from '@mui/material'

import SvgHelpIcon from 'assets/icons/SvgHelpIcon'

const NotificationCenter = () => {
    const { classes } = useStyles()
    const theme = useTheme<Theme>()
    const [iconColor, setIconColor] = React.useState<string>(
        theme?.palette.common.secondaryText || ''
    )

    const handleOnMouseLeave = () => {
        setIconColor(theme?.palette.common.secondaryText || '')
    }

    const handleOnMouseEnter = () => {
        setIconColor(theme?.palette.common.primaryText || '')
    }

    return (
        <QplusBaseIconTooltip title={'PoC Analytics and Reporting version 0.9. Coming soon!'}>
            <ButtonBase
                className={classes.button}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}>
                <Badge classes={{ badge: classes.customBadge }} variant="dot">
                    <SvgHelpIcon fill={iconColor} />
                </Badge>
            </ButtonBase>
        </QplusBaseIconTooltip>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    customBadge: {
        backgroundColor: theme?.palette.common.ui0,
        color: theme?.palette.common.whiteText
    },
    button: {
        height: 60,
        width: 60,
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.text.primary,
        padding: theme.spacing(1),
        textAlign: theme.direction === 'ltr' ? 'left' : 'right',
        marginRight: '10px',
        '@media (max-width: 500px)': {
            width: 32,
            marginRight: 0,
            '& > span': {
                width: '24px'
            }
        }
    }
}))

export default React.memo(NotificationCenter)
