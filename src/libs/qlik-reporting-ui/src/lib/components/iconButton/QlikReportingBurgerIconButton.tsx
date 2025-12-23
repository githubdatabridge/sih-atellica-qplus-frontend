import React, { FC, useState, useEffect } from 'react'

import { useMediaQuery } from 'react-responsive'

import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import { Box, IconButton, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { IconTooltip } from '@libs/common-ui'

interface IQlikReportingBurgerIconButtonProps {
    isOpen?: boolean
    isCreated?: boolean
    handleMenuOpenCallback?: (status: boolean) => void
}

const QlikReportingBurgerIconButton: FC<IQlikReportingBurgerIconButtonProps> = ({
    isOpen = true,
    isCreated = false,
    handleMenuOpenCallback
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true)
    const isTablet = useMediaQuery({ query: '(max-width: 1001px)' })

    const { classes } = useStyles()

    useEffect(() => {
        setIsMenuOpen(!isOpen)
    }, [])

    useEffect(() => {
        if (isTablet) {
            setIsMenuOpen(true)
        }
    }, [isTablet])

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen)
        if (handleMenuOpenCallback) handleMenuOpenCallback(!isMenuOpen)
    }

    return (
        <Box width="59px" display="flex" justifyContent="center" alignItems="center" height="100%">
            <IconTooltip title={!isMenuOpen ? 'Close' : 'Open'} placement="top">
                <IconButton
                    color="primary"
                    aria-label="locker"
                    component="span"
                    onClick={handleMenuClick}
                    classes={{
                        root: classes.iconButton
                    }}>
                    {!isMenuOpen ? <MenuOpenIcon /> : <MenuIcon />}
                </IconButton>
            </IconTooltip>
        </Box>
    )
}

export default QlikReportingBurgerIconButton

const useStyles = makeStyles()((theme: Theme) => ({
    iconText: {
        fontSize: '0.9rem'
    },

    iconButton: {
        backgroundColor: 'transparent',
        color: theme.palette.primary.contrastText,
        '&:hover': {
            backgroundColor: 'transparent',
            color: theme.palette.primary.contrastText
        },
        '&:hover $icon': {
            color: theme.palette.primary.contrastText
        }
    }
}))
