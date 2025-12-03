import React, { FC, useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import {
    QPLUS_KEYS,
    QplusLocalStorage,
    useQplusAuthContext,
    useQplusCoreAuthContext
} from '@databridge/qplus'
import { Theme } from '@mui/material'

import { useAppContext } from 'app/context/AppContext'
import { dashboardUrl } from 'app/layout/constants/constants'

interface IUserAvatar {
    mode?: string
}

const UserAvatar: FC<IUserAvatar> = ({ mode = 'dark' }) => {
    const [open, setOpen] = React.useState<boolean>(false)
    const [isGodModeVisible, setIsGodModeVisible] = React.useState<boolean>(false)
    const anchorRef = React.useRef<any>(null)
    const [avatar, setAvatar] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const { appUser } = useQplusAuthContext()
    const isTablet = useMediaQuery({ query: '(max-width: 1001px)' })
    const { setIsAdminRole, logoutUser, isAdminRole, defaultPage } = useAppContext()
    const [isAdmin, setIsAdmin] = React.useState<boolean>(isAdminRole)
    const { logout } = useQplusCoreAuthContext()
    const navigate = useNavigate()

    useEffect(() => {
        setIsAdmin(isAdminRole)
    }, [isAdminRole])

    useEffect(() => {
        if (!isAdmin) {
            const { pathname } = new URL(window.location.href)
            const isHashRoute = window.location.hash?.startsWith('#')
            const path = isHashRoute ? window.location.hash.substring(2) : pathname

            navigate(`${path}`, { replace: true })
        }
    }, [defaultPage, navigate, isAdmin])

    useEffect(() => {
        if (appUser) {
            setUsername(appUser.name)
            setAvatar(appUser.avatar)
            setIsGodModeVisible(appUser?.roles?.includes('admin'))
        }
    }, [appUser])

    const handleClose = (event: any) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return
        }
        setOpen(false)
    }

    const handleToggle = () => {
        setOpen((prevOpen: boolean) => !prevOpen)
    }

    const handleLogout = async () => {
        try {
            await logout()
            logoutUser()
        } catch (error) {
            console.log('DEV Logout', error)
        }
    }

    useEffect(() => {
        if (!isAdmin) {
            // Because of this hook, it is forwarded to the demo page after every refresh
            navigate(`${dashboardUrl}/${defaultPage}`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin])

    const handleIsAdminSwitch = () => {
        setIsAdmin((prev: boolean) => !prev)
        QplusLocalStorage.save(QPLUS_KEYS.QPLUS_ROLE_IS_ADMIN, !isAdmin)
        setIsAdminRole(!isAdmin)
    }

    const useStyles = makeStyles()((theme: Theme) => ({
        root: {
            display: 'flex',
            '& > *': {
                margin: theme.spacing(1)
            }
        },
        avatar: {
            color: theme.palette.common.secondaryText,
            backgroundColor: theme.palette.common.highlight10,
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: 0,
            lineHeight: '20px',
            textAlign: 'center',
            height: '40px',
            width: '40px',
            '&:hover': {
                color: theme.palette.common.secondaryText,
                backgroundColor: theme.palette.common.highlight10,
                boxShadow: 'none !important'
            }
        },
        button: {
            height: '40px',
            borderRadius: '32px',
            backgroundColor: `${theme.palette.primary.contrastText} !important`,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
            boxShadow: 'none',
            '&:hover': {
                //you want this to be the same as the backgroundColor above
                backgroundColor: `${theme.palette.primary.contrastText} !important`,
                boxShadow: 'none !important'
            }
        },
        paper: {
            marginRight: theme.spacing(2)
        },
        icon: {
            color: '#273540',
            width: '24px',
            height: '24px'
        },
        menuItem: {
            fontWeight: 500,
            color: '#000'
        },
        username: {
            textAlign: 'left',
            paddingLeft: '10px',
            color: theme.palette.text.primary,
            fontWeight: 500,
            fontSize: '0.825rem !important',
            '&:hover': {
                color: theme.palette.text.primary
            },
            '@media (max-width: 1238px)': {
                display: 'none'
            }
        },
        listItemCheckbox: {
            marginLeft: '5px',
            width: '20px',
            height: '20px',
            '&:hover': {
                backgroundColor: 'transparent'
            }
        },
        dropdown: {
            '@media (max-width: 1238px)': {
                left: '0px !important'
            },
            '@media (max-width: 675px)': {
                left: '-15px !important'
            },
            '@media (max-width: 655px)': {
                left: '-25px !important'
            },
            '@media (max-width: 630px)': {
                left: '-30px !important'
            },
            '@media (max-width: 590px)': {
                left: '-35px !important'
            }
        }
    }))

    const { classes } = useStyles()

    return (
        <div className={classes.root}>
            <Button
                ref={anchorRef}
                aria-controls={open ? 'menu-avatar-grow' : undefined}
                aria-haspopup="true"
                variant="contained"
                classes={{
                    root: classes.button
                }}
                onClick={handleToggle}>
                {' '}
                <Avatar src="" className={classes.avatar}>
                    {avatar}
                </Avatar>
                {!isTablet && <Typography className={classes.username}>{username}</Typography>}
            </Button>
            <Popper
                className={classes.dropdown}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                style={{ zIndex: 1000000000 }}>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            zIndex: 1000000000,
                            transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
                        }}>
                        <Paper style={{ zIndex: 1000000000, minWidth: '150px' }}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={open}
                                    id="menu-avatar-grow"
                                    style={{ zIndex: 1000000000, fontSize: '12px' }}>
                                    <MenuItem
                                        className={classes.menuItem}
                                        onClick={e => handleLogout()}>
                                        Logout
                                    </MenuItem>
                                    {isGodModeVisible && (
                                        <MenuItem className={classes.menuItem}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            defaultChecked={isAdmin}
                                                            color="secondary"
                                                            onClick={e => handleIsAdminSwitch()}
                                                        />
                                                    }
                                                    label="Admin"
                                                />
                                            </FormGroup>
                                        </MenuItem>
                                    )}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    )
}

export default React.memo(UserAvatar)
