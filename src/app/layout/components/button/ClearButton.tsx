import React from 'react'
import { makeStyles } from 'tss-react/mui'
import Button from '@mui/material/Button'
import { Theme } from '@mui/material'
import { useQlikAppContext } from '@databridge/qlik-providers'

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        height: '40px',
        borderRadius: '16px',
        backgroundColor: 'transparent',
        border: `1px solid ${theme.palette.common.highlight15}`,
        color: '#000000',
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: 0,
        lineHeight: '20px',
        boxShadow: 'none',
        textTransform: 'none',
        minWidth: '138px',
        '&:hover': {
            //you want this to be the same as the backgroundColor above
            backgroundColor: 'transparent',
            boxShadow: 'none'
        }
    },
    buttonFilter: {
        height: '35px',
        width: '140px',
        maxWidth: '175px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '25px',
        backgroundColor: 'transparent',
        color: theme.palette.common.primaryText,
        marginTop: '2px',
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: 0,
        lineHeight: '20px',
        textAlign: 'center',
        boxShadow: 'none',
        textTransform: 'none',
        '&:hover': {
            backgroundColor: theme.palette.common.highlight10,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: '#EBEBEB',
            color: theme.palette.secondary.dark,
            boxShadow: 'none'
        }
    },
    icon: {
        color: '#000000'
    }
}))

export default function ClearButton() {
    const { classes } = useStyles()
    const { qAppMap } = useQlikAppContext()

    const clearAllHandler = () => {
        for (const [, value] of qAppMap) {
            value?.qApi?.clearAll()
        }
    }

    return (
        <Button variant="outlined" className={classes.root} onClick={clearAllHandler}>
            Clear Selections
        </Button>
    )
}
