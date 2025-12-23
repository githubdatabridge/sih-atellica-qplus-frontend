import React, { FC, useState, useEffect } from 'react'

import { Theme } from '@mui/material'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'

import { makeStyles } from 'tss-react/mui'

type TBaseSideDrawerClasses = {
    root?: string
    paper?: string
}

export interface IBaseSideDrawer {
    anchor?: string
    isDrawerOpen?: boolean
    node?: React.ReactNode
    classNames?: TBaseSideDrawerClasses
}

const BaseSideDrawer: FC<IBaseSideDrawer> = ({
    anchor = 'right',
    node,
    isDrawerOpen,
    classNames
}) => {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const { classes } = useStyles()

    useEffect(() => {
        setDrawerOpen(isDrawerOpen)
        return () => {
            setDrawerOpen(false)
        }
    }, [isDrawerOpen])

    const toggleDrawer = () => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return
        }
        setDrawerOpen(!drawerOpen)
    }

    return (
        node && (
            <SwipeableDrawer
                anchor={
                    anchor === 'right'
                        ? 'right'
                        : anchor === 'left'
                        ? 'left'
                        : anchor === 'top'
                        ? 'top'
                        : 'bottom'
                }
                open={drawerOpen}
                onClose={toggleDrawer()}
                onOpen={toggleDrawer()}
                classes={{
                    root: classNames?.root || classes.root,
                    paper: classNames?.paper || classes.paper
                }}>
                {node}
            </SwipeableDrawer>
        )
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    paper: {
        backgroundColor: theme.palette.primary.main
    },
    root: {
        top: '64px !important',
        '& > div': {
            top: '64px !important'
        },
        '@media (max-width: 599px)': {
            top: '56px !important',
            '& > div': {
                top: '56px !important'
            }
        }
    }
}))

export default BaseSideDrawer
