import React, { useState, useEffect } from 'react'

import { Theme } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: Theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff'
    }
}))

export interface IBackdropLoaderProps {
    isLoading: boolean
}

const BackdropLoader: React.FC<IBackdropLoaderProps> = ({ isLoading }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const { classes } = useStyles()

    useEffect(() => {
        setLoading(isLoading)
        return () => {}
    }, [isLoading])

    return (
        <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="secondary" />
        </Backdrop>
    )
}

export default BackdropLoader
