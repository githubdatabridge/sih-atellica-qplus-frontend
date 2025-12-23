import React from 'react'

import { Box, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import SvgLoader from '../../res/icons/SvgLoader'
import { useLoaderContext } from '../loaders/LoaderContext'

export const FullScreenLoader = () => {
    const { classes } = useStyles()
    const { titleNode, loaderMessage } = useLoaderContext()

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            width="100vw"
            className={classes.background}>
            <SvgLoader />
            {titleNode || null}
            <span className={classes.textLoader}>Loading...</span>
            <span className={classes.textMessage}>
                {`Message: ${loaderMessage || 'Start assets loading'}`}
            </span>
        </Box>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    background: {
        backgroundColor: theme.palette.primary.main
    },
    textLoader: {
        marginTop: '30px',
        fontWeight: 500,
        opacity: 0.8,
        fontSize: '1.3em',
        fontFamily: [
            'Open Sans',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(','),
        color: '#FFF'
    },
    textMessage: {
        marginTop: '10px',
        fontWeight: 500,
        opacity: 1,
        fontSize: '1em',
        color: '#BBDC00',
        fontFamily: [
            'Open Sans',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(',')
    },
    progress: {
        color: theme.palette.secondary.main
    }
}))
export default FullScreenLoader
