import React, { useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import { Box, Theme } from '@mui/material'
import { useWindowDimensions } from '@databridge/qplus'

import { useAppContext } from 'app/context/AppContext'
import { OFFSET_COLLAPSED, OFFSET_EXPANDED } from 'app/common/config'

interface IDashboardTemplateProps {
    children: React.ReactNode
}

const DashboardTemplate: React.FC<IDashboardTemplateProps> = ({ children }) => {
    const [windowHeight, setWindowHeight] = useState<number>(0)
    const { height } = useWindowDimensions()
    const { isHeaderVisible } = useAppContext()

    const { classes } = useStyles()

    useEffect(() => {
        setWindowHeight(height)
    }, [height])

    if (windowHeight === 0) return null

    return (
        <Box
            className={classes.content}
            sx={{
                marginTop: isHeaderVisible ? `${OFFSET_EXPANDED}px` : `${OFFSET_COLLAPSED}px`,
                height: `${windowHeight - (isHeaderVisible ? OFFSET_EXPANDED : OFFSET_COLLAPSED)}px`
            }}>
            {children}
        </Box>
    )
}

export default DashboardTemplate

const useStyles = makeStyles()((theme: Theme) => ({
    header: {
        boxShadow: '0 0 0rem rgba(0,0,0,0.20);'
    },
    content: {
        padding: '16px',
        backgroundColor: theme.palette.common.base1,
        overflowY: 'scroll'
    }
}))
