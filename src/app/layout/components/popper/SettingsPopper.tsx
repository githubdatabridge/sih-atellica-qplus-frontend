import React, { FC, useState, useRef, useEffect } from 'react'
import { makeStyles } from 'tss-react/mui'
import { useMount } from 'react-use'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import SettingsIcon from '@mui/icons-material/Settings'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import { userService } from '@databridge/core-services'
import {
    QplusLocalStorage,
    QPLUS_KEYS,
    QplusBaseIconTooltip,
    useQplusAuthContext
} from '@databridge/qplus'
import { Theme } from '@mui/material'

import { useAppContext } from 'app/context/AppContext'

interface ISettingsPopper {
    mode?: string
}

const SettingsPopper: FC<ISettingsPopper> = ({ mode = 'dark' }) => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const [, setUser] = useState<any>(null)
    const [, setOpenPreferences] = useState(false)
    const anchorRef = useRef(null)
    const theme = useTheme<Theme>()
    const [color, setColor] = useState<any>(theme.palette.primary.contrastText)
    const { appUser } = useQplusAuthContext()
    const { isAdminRole, setIsAdminRole } = useAppContext()
    const { pathname } = useLocation()

    const useStyles = makeStyles()((theme: Theme) => ({
        root: {
            display: 'flex'
        },
        menuItem: {
            fontWeight: 500
        },
        text: {
            color: theme.palette.text.primary,
            '&:hover': {
                color: theme.palette.primary.contrastText
            }
        },
        icon: {
            width: 32,
            height: 32,
            backgroundColor: 'transparent',
            color: theme!.palette.common.secondaryText,
            '&:hover': {
                backgroundColor: 'transparent',
                color: theme!.palette.common.secondaryText
            },
            '@media (max-width: 500px)': {
                width: '24px'
            }
        },
        iconActive: {
            width: 32,
            height: 32,
            backgroundColor: 'transparent',
            color: theme!.palette.secondary.main,
            '&:hover': {
                backgroundColor: 'transparent',
                color: theme!.palette.secondary.main
            },
            '@media (max-width: 500px)': {
                width: '24px'
            }
        },
        settingsIconButton: {
            backgroundColor: 'transparent',
            '&:hover': {
                cursor: 'pointer',
                backgroundColor: 'transparent'
            },
            '@media (max-width: 500px)': {
                padding: '6px',
                '& > span': {
                    width: '24px'
                }
            }
        }
    }))

    useMount(async () => {
        const currentUser = await userService.getCurrentUser()
        setUser(currentUser)
    })

    useEffect(() => {
        if (appUser?.roles?.includes('admin')) {
            QplusLocalStorage.save(QPLUS_KEYS.QPLUS_ROLE_IS_ADMIN, true)
            setIsAdminRole(true)
        } else {
            QplusLocalStorage.save(QPLUS_KEYS.QPLUS_ROLE_IS_ADMIN, true)
            setIsAdminRole(false)
        }
    }, [appUser?.roles, setIsAdminRole])

    useEffect(() => {
        setIsAdmin(isAdminRole)
    }, [isAdminRole])

    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen)
    }

    const handleClose = (event: any) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return
        }
        setOpen(false)
    }

    const handleOpenPreferences = (event: any, isOpen: boolean) => {
        setOpenPreferences(isOpen)
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return
        }
        setOpen(false)
    }

    const handleIconMouseOver = () => {
        setColor(theme.palette.text.primary)
    }

    const handleIconMouseLeave = () => {
        setColor(theme.palette.text.primary)
    }

    const { classes } = useStyles()

    return appUser && appUser?.roles?.includes('admin') ? (
        <div className={classes.root}>
            <QplusBaseIconTooltip title={'Settings'}>
                <IconButton
                    ref={anchorRef}
                    onClick={handleToggle}
                    className={classes.settingsIconButton}
                    onMouseOver={handleIconMouseOver}
                    onMouseLeave={handleIconMouseLeave}
                    disabled={!isAdmin}>
                    <SettingsIcon
                        fill={color}
                        className={
                            pathname?.includes('administration') ? classes.iconActive : classes.icon
                        }
                    />
                </IconButton>
            </QplusBaseIconTooltip>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                style={{ zIndex: 9999 }}>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            zIndex: 9999,
                            transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
                        }}>
                        <Paper style={{ zIndex: 1000000000 }}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList style={{ zIndex: 1000000000, fontSize: '12px' }}>
                                    <MenuItem
                                        className={classes.menuItem}
                                        onClick={e => handleOpenPreferences(e, true)}>
                                        <Link
                                            style={{ color: 'inherit', textDecoration: 'none' }}
                                            to="/apps/dashboards/administration">
                                            <Typography className={classes.text}>
                                                Administration
                                            </Typography>
                                        </Link>
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    ) : null
}

export default React.memo(SettingsPopper)
