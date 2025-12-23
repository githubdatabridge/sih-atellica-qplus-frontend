import { Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

export const createStyles = (color: string) =>
    makeStyles()((theme: Theme) => ({
        customBadge: {
            backgroundColor:
                color === 'secondary'
                    ? theme.palette.secondary.main
                    : color === 'primary'
                    ? theme.palette.primary.main
                    : theme.palette.info.main,
            color:
                color === 'secondary'
                    ? theme.palette.secondary.contrastText
                    : color === 'primary'
                    ? theme.palette.primary.contrastText
                    : theme.palette.info.contrastText
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
                marginRight: 0
            }
        },
        icon: {
            width: 32,
            height: 32
        },
        iconButton: {}
    }))
