import React from 'react'

import { useTheme, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: Theme) => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '20px'
    },
    border: {
        borderBottom: `2px solid ${theme.palette.primary.main}`,
        width: '100%'
    },
    content: {
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        fontWeight: 500,
        fontSize: 14,
        minWidth: '100px',
        textAlign: 'center'
    }
}))

const DividerWithText = ({ children, color }) => {
    const { classes } = useStyles()
    const theme = useTheme()
    return (
        <div className={classes.container}>
            <div className={classes.border} />
            <span
                className={classes.content}
                style={{
                    color:
                        color === 'secondary'
                            ? theme.palette.secondary.main
                            : color === 'primary'
                            ? theme.palette.primary.main
                            : theme.palette.secondary.dark
                }}>
                {children}
            </span>
            <div className={classes.border} />
        </div>
    )
}
export default DividerWithText
