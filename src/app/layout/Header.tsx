import React, { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { makeStyles } from 'tss-react/mui'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import { Theme } from '@mui/material'

import { QplusNotificationCenter } from '@databridge/qplus'

import { useAppContext } from 'app/context/AppContext'
import SvgLogo from 'assets/icons/logo.svg'

import AvatarButton from './components/button/AvatarButton'
import FilterButton from './components/button/FilterButton'
import SettingsPopper from './components/popper/SettingsPopper'
import Navbar from './Navbar'
import HelpBadge from './components/badge/HelpBadge'
import SideDrawer from './SideDrawer'

const Header = () => {
    const { classes } = useStyles()
    const { isHeaderVisible, selectionCount, pages } = useAppContext()
    const isTablet = useMediaQuery({ query: '(max-width: 951px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 750px)' })
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const handleDrawerClose = () => {
        setIsDrawerOpen(false)
    }

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar disableGutters className={classes.toolbar}>
                {isTablet && (
                    <Box
                        mt={1}
                        mr={2}
                        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                        style={{ zIndex: 1301 }}>
                        <MenuIcon className={classes.burgerMenu} fontSize="large" />
                    </Box>
                )}
                <Box flexGrow={0} mt={1} mr={6} className={classes.logo}>
                    <img src={SvgLogo} alt="Logo" style={{ height: '2.5rem', width: '8.125rem' }} />
                </Box>
                {!isMobile && (
                    <Box mt={1}>
                        <Typography className={classes.title}>PoC Self Service</Typography>
                    </Box>
                )}
                <Box flexGrow={1} mt={1}>
                    {!isTablet && <Navbar />}
                </Box>
                <Box p={1} className={classes.empty}></Box>
                {pages.get('reporting') && <SettingsPopper />}
                {!isHeaderVisible && selectionCount > 0 && <FilterButton />}
                <HelpBadge />
                {pages.get('reporting') && <QplusNotificationCenter color="info" />}
                <AvatarButton />
            </Toolbar>
            {isTablet && <SideDrawer isOpen={isDrawerOpen} closeDrawer={handleDrawerClose} />}
        </AppBar>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    appBar: {
        zIndex: 2,
        height: 72,
        backgroundColor: theme.palette.background.paper,
        boxShadow: 'inset 0 -1px 0 0 #EBEBEB'
    },
    toolbar: {
        paddingLeft: theme.spacing(3),
        minHeight: 72
    },
    logo: {
        '@media (max-width: 1029px)': {
            marginRight: 20
        },
        '@media (max-width: 570px)': {
            display: 'none'
        }
    },
    brand: {
        flexGrow: 1
    },
    divider: {
        height: 72
    },
    title: {
        color: theme?.palette.common.primaryText,
        fontSize: '1rem',
        maxWidth: '18.5rem',
        lineHeight: '2rem',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontFamily: 'bree-headline'
    },
    empty: {
        marginRight: '20px',
        '@media (max-width: 971px)': {
            marginRight: '0px'
        }
    },
    burgerMenu: {
        color: theme?.palette.common.secondaryText,
        cursor: 'pointer',
        '&:hover': {
            color: theme?.palette.common.primaryText
        }
    },
    customBadge: {
        marginRight: '10px',
        marginTop: '10px',
        backgroundColor: theme.palette.info.main,
        color: theme.palette.info.contrastText
    },
    notificationButton: {
        fontSize: '12px',
        fontWeight: 500,
        height: '30px',
        borderRadius: '25px',
        minWidth: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.info.main,
        color: theme.palette.info.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
            boxShadow: 'none'
        },
        cursor: 'pointer',
        '@media (max-width: 350px)': {
            minWidth: '120px'
        }
    }
}))

export default Header
