import React, { FC } from 'react'

import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'

import { makeStyles } from 'tss-react/mui'

export interface IQlikCardInfoFooterProps {
    text: string
}

const QlikCardInfoFooter: FC<IQlikCardInfoFooterProps> = React.memo(({ text = '' }) => {
    const { classes } = useStyles()
    return (
        <Box flexGrow={1} width={1} className={classes.box}>
            <Typography className={classes.label}>{text}</Typography>
        </Box>
    )
})

export default QlikCardInfoFooter

const useStyles = makeStyles()((theme: any) => ({
    box: {
        marginLeft: '5px',
        marginBottom: '3px'
    },
    label: {
        color: '#FFF',
        fontSize: '0.6rem',
        opacity: 0.8
    }
}))
