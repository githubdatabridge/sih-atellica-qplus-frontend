import React, { useState, useRef } from 'react'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import { QplusBaseIconTooltip } from '@databridge/qplus'
import { Theme } from '@mui/material'

import SvgFilterIcon from 'assets/icons/SvgFilterIcon'
import { useAppContext } from 'app/context/AppContext'
import SelectionBar from '../chip/SelectionBar'

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center'
    },
    notificationIconButton: {
        '&:hover': {
            cursor: 'pointer'
        },
        '@media (max-width: 500px)': {
            padding: '6px',
            '& span': {
                width: '24px'
            }
        }
    },
    list: {
        width: 250
    },
    customBadge: {
        backgroundColor: theme.palette.common.ui0,
        color: theme.palette.common.whiteText
    },
    paper: {
        top: '64px',
        boxShadow: 'none'
    },
    navTitle: {
        paddingLeft: '30px',
        backgroundColor: 'transparent',
        cursor: 'default',
        '&:hover': {
            backgroundColor: 'transparent !important'
        }
    },
    navItem: {
        width: '100%',
        textAlign: 'start',
        '& span': {
            fontSize: '18px'
        }
    },
    backdrop: {
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

export default function FilterButton() {
    const { selectionCount } = useAppContext()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const { classes } = useStyles()
    const theme = useTheme<Theme>()
    const [color, setColor] = React.useState<any>(theme.palette.common.secondaryText)
    const anchorRef = useRef(null)

    const handleIconMouseOver = () => {
        setColor(theme.palette.common.primaryText)
    }

    const handleIconMouseLeave = () => {
        setColor(theme.palette.common.secondaryText)
    }

    const toggleDrawer = () => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return
        }

        setIsDrawerOpen(!isDrawerOpen)
    }

    const list = () => (
        <div className={classes.list} role="presentation" onKeyDown={toggleDrawer()}>
            <Box>
                <SelectionBar isVertical={true} />
            </Box>
        </div>
    )

    return (
        <div className={classes.root}>
            <div>
                <QplusBaseIconTooltip title={'Notification Center'}>
                    <IconButton
                        ref={anchorRef}
                        className={classes.notificationIconButton}
                        onMouseOver={handleIconMouseOver}
                        onMouseLeave={handleIconMouseLeave}
                        onClick={toggleDrawer()}>
                        <Badge
                            classes={{ badge: classes.customBadge }}
                            badgeContent={selectionCount}>
                            <SvgFilterIcon fill={color} />
                        </Badge>
                    </IconButton>
                </QplusBaseIconTooltip>
                <SwipeableDrawer
                    className={classes.backdrop}
                    anchor="right"
                    open={isDrawerOpen}
                    onClose={toggleDrawer()}
                    onOpen={toggleDrawer()}
                    classes={{ paper: classes.paper }}>
                    {list()}
                </SwipeableDrawer>
            </div>
        </div>
    )
}
