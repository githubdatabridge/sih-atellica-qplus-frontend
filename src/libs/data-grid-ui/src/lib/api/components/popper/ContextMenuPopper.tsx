import React, { FC, ReactNode } from 'react'

import { useCopyToClipboard } from 'react-use'

import { CopyAll } from '@mui/icons-material'
import {
    Box,
    Paper,
    Popper,
    MenuList,
    MenuItem,
    ClickAwayListener,
    Fade,
    ListItemText,
    ListItemIcon,
    Theme
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { AlertType, useAlertContext } from '@libs/common-ui'

const useMenuStyles = makeStyles()((theme: Theme) => ({
    /* Styles applied to the `Paper` component. */
    paper: {
        // specZ: The maximum height of a simple menu should be one or more rows less than the view
        // height. This ensures a tapable area outside of the simple menu with which to dismiss
        // the menu.
        maxHeight: 'calc(100% - 96px)',
        // Add iOS momentum scrolling.
        WebkitOverflowScrolling: 'touch',
        zIndex: 9999,
        boxShadow:
            '0px 2px 1px -1px rgb(0 0 0 / 0%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)'
    },
    /* Styles applied to the `List` component via `MenuList`. */
    list: {
        // We disable the focus ring for mouse, touch and keyboard users.
        outline: 0
    },
    menuItemRoot: {
        '&:hover': {
            backgroundColor: `${theme.palette.background.default} !important`,
            color: `${theme.palette.text.primary} !important`
        }
    },
    menuItemText: {
        fontSize: '0.825rem'
    }
}))

interface IContextMenuPopper {
    cellValue: string
    children: ReactNode
}

export const ContextMenuPopper: FC<IContextMenuPopper> = ({ cellValue, children }) => {
    const [open, setOpen] = React.useState(false)
    const [anchorEl, setAnchorEl] = React.useState<null | any>(null)
    const [, copy] = useCopyToClipboard()
    const { showToast } = useAlertContext()

    const handleClose = () => {
        setOpen(false)
    }

    const handleContextMenu = (e: { preventDefault?: any; clientX?: any; clientY?: any }) => {
        e.preventDefault()
        const { clientX, clientY } = e
        setOpen(true)
        const virtualElement = {
            getBoundingClientRect: () => ({
                width: 0,
                height: 0,
                top: clientY,
                right: clientX,
                bottom: clientY,
                left: clientX
            })
        }
        setAnchorEl(virtualElement)
    }

    const handleCopyValueClick = () => {
        copy(cellValue)
        showToast('Value copied!', AlertType.SUCCESS)
        setOpen(false)
    }

    const id = open ? 'cell-reference-popper' : undefined
    const { classes: menuClasses } = useMenuStyles()

    return (
        <Box>
            <Box onContextMenu={handleContextMenu}>{children}</Box>
            <Popper id={id} open={open} anchorEl={anchorEl} transition placement="bottom-start">
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Fade {...TransitionProps}>
                            <Paper className={menuClasses.paper}>
                                <MenuList className={menuClasses.list} autoFocus>
                                    <MenuItem onClick={handleCopyValueClick}>
                                        <ListItemIcon>
                                            <CopyAll />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Copy Value"
                                            classes={{
                                                primary: menuClasses.menuItemText
                                            }}
                                        />
                                    </MenuItem>
                                </MenuList>
                            </Paper>
                        </Fade>
                    </ClickAwayListener>
                )}
            </Popper>
        </Box>
    )
}
